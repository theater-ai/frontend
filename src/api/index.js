// Vite 환경변수에서 API 기본 주소를 가져옵니다. 
// (.env 파일에 VITE_API_BASE_URL=http://localhost:8000 설정 필요)
// 설정이 없다면 기본값으로 http://localhost:8000을 사용합니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  /**
   * 실시간 영화 제목 자동완성 (KOBIS API 직접 검색)
   * @param {string} query - 검색할 영화 제목 조각
   * @returns {Promise<Object>} - { query: string, suggestions: Array }
   */
  async suggest(query) {
    if (!query) return { suggestions: [] };
    const res = await fetch(`${API_BASE_URL}/movies/suggest?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('자동완성 데이터를 가져오는 데 실패했습니다.');
    return res.json();
  },

  /**
   * DB에 이미 적재된 영화 목록 검색
   * @param {string} query - 검색할 영화 제목
   * @returns {Promise<Object>} - { query: string, count: number, results: Array }
   */
  async search(query) {
    if (!query) return { results: [] };
    const res = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('영화 검색에 실패했습니다.');
    return res.json();
  },

  /**
   * 새로운 영화 스크래핑 및 DB 적재 (KOBIS + TMDB)
   * @param {string} title - 적재할 영화 제목
   * @returns {Promise<Object>} - { movie_cd, movie_nm, boxoffice_rows, message }
   */
  async scrape(title) {
    const res = await fetch(`${API_BASE_URL}/movies/scrape?title=${encodeURIComponent(title)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 404 등 백엔드에서 내려주는 에러 메시지 처리를 위해 분기
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || '영화 데이터를 적재하는 데 실패했습니다.');
    }
    
    return res.json();
  },

  /**
   * 특정 영화의 대시보드 통계 데이터 조회
   * @param {string} movieCd - 영화 고유 코드
   * @param {string} [dateFrom] - 조회 시작일 (YYYY-MM-DD)
   * @param {string} [dateTo] - 조회 종료일 (YYYY-MM-DD)
   * @returns {Promise<Object>} - 영화 상세 정보 및 박스오피스 시계열 데이터
   */
  async getDashboard(movieCd, dateFrom = null, dateTo = null) {
    // 쿼리 파라미터 조립
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/movies/${movieCd}/dashboard${queryString}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || '대시보드 데이터를 불러올 수 없습니다.');
    }
    
    return res.json();
  }
};