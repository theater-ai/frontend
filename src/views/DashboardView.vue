<template>
  <div v-if="loading && !dashboardData" class="flex justify-center py-20 text-blue-500 animate-pulse font-bold">
    마케팅 인사이트를 분석 중입니다...
  </div>

  <div v-else-if="dashboardData" class="max-w-7xl mx-auto p-6 pb-20 bg-gray-50 min-h-screen">
    
    <div class="flex flex-col md:flex-row gap-10 mb-10 items-start p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <img 
        v-if="dashboardData.movie.poster_url" 
        :src="dashboardData.movie.poster_url" 
        alt="영화 포스터" 
        class="w-full md:w-60 h-auto rounded-2xl shadow-xl object-cover flex-shrink-0"
      />
      <div v-else class="w-full md:w-60 h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0">
        포스터 없음
      </div>

      <div class="flex-1 min-w-0">
        <div class="mb-5">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-gray-950">
            {{ dashboardData.movie.movie_nm }} 
          </h1>
          <p class="text-lg text-gray-500 font-medium">{{ dashboardData.movie.movie_nm_en }}</p>
          <div class="flex flex-wrap gap-2 text-sm mt-4">
            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">개봉: {{ dashboardData.movie.open_dt || '미정' }}</span>
            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">{{ dashboardData.movie.rep_genre_nm }}</span>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-sm font-bold mb-2 text-gray-400 tracking-wider uppercase">줄거리</h3>
          <p class="text-gray-800 leading-relaxed text-[15px] max-h-40 overflow-y-auto pr-2">
            {{ dashboardData.movie.synopsis || '등록된 줄거리가 없습니다.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 border-t border-gray-100 pt-5">
          <p><strong>감독:</strong> {{ dashboardData.directors.map(d => d.person.people_nm).join(', ') || '정보 없음' }} </p>
          <p><strong>주요 배우:</strong> {{ dashboardData.actors.slice(0, 5).map(a => a.person.people_nm).join(', ') || '정보 없음' }}</p>
        </div>
      </div>
    </div>

    <div v-if="latestData && latestData.target_date" class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        📊 최신 박스오피스 요약
        <span class="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-md">기준일: {{ latestData.target_date }}</span>
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">박스오피스 순위</span>
          <span class="text-3xl font-black text-gray-900">{{ latestData.rank_num }}<span class="text-lg font-bold text-gray-500">위</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">일일 관객수</span>
          <div>
            <span class="text-3xl font-black text-blue-600">{{ (latestData.audi_cnt || 0).toLocaleString() }}</span>
            <span class="text-sm font-bold ml-1" :class="latestData.audi_change_dod > 0 ? 'text-red-500' : 'text-blue-500'">
              ({{ latestData.audi_change_dod > 0 ? '+' : '' }}{{ (latestData.audi_change_dod || 0).toLocaleString() }})
            </span>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">일일 매출액</span>
          <span class="text-3xl font-black text-gray-900">{{ (latestData.sales_amt || 0).toLocaleString() }}<span class="text-lg font-bold text-gray-500">원</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">누적 관객수</span>
          <span class="text-3xl font-black text-indigo-600">{{ (latestData.acc_audi_cnt || 0).toLocaleString() }}<span class="text-lg font-bold text-gray-500">명</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">상영 점유율</span>
          <span class="text-3xl font-black text-purple-600">{{ latestData.show_share || 0 }}<span class="text-lg font-bold text-gray-500">%</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">좌석 판매율</span>
          <span class="text-3xl font-black text-rose-500">{{ latestData.seat_sales_rate || 0 }}<span class="text-lg font-bold text-gray-500">%</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">스크린수</span>
          <span class="text-3xl font-black text-gray-900">{{ (latestData.screen_cnt || 0).toLocaleString() }}<span class="text-lg font-bold text-gray-500">개</span></span>
        </div>
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span class="text-sm text-gray-500 font-bold mb-1">상영횟수</span>
          <span class="text-3xl font-black text-gray-900">{{ (latestData.show_cnt || 0).toLocaleString() }}<span class="text-lg font-bold text-gray-500">회</span></span>
        </div>
      </div>
    </div>

    <div class="sticky top-4 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200">
      <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        분석 기간 설정
      </h2>
      <div class="flex items-center gap-2">
        <input type="date" v-model="dateFrom" class="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
        <span class="text-gray-400 font-medium">~</span>
        <input type="date" v-model="dateTo" class="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
        <button 
          @click="applyDateRange" 
          class="ml-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '적용 중...' : '적용' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div>
          <h3 class="text-xl font-bold text-gray-950">일자별 상세 데이터</h3>
          <p class="text-sm text-gray-500 mt-1">최근 7일치 데이터만 표시됩니다.</p>
        </div>
        
        <a 
          :href="`https://kobis.or.kr/kobis/business/main/main.do`" 
          target="_blank" 
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
        >
          전체 데이터 보기 (KOBIS)
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-right text-gray-600 whitespace-nowrap">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3 text-center sticky left-0 bg-gray-100 z-10 border-r">날짜</th>
              <th scope="col" class="px-4 py-3 text-center">순위</th>
              <th scope="col" class="px-4 py-3">관객수<br/><span class="text-[10px] text-gray-400 font-normal">(전일비)</span></th>
              <th scope="col" class="px-4 py-3">매출액<br/><span class="text-[10px] text-gray-400 font-normal">(전일비)</span></th>
              <th scope="col" class="px-4 py-3">상영점유율</th>
              <th scope="col" class="px-4 py-3">좌석판매율</th>
              <th scope="col" class="px-4 py-3">스크린수<br/><span class="text-[10px] text-gray-400 font-normal">(점유율)</span></th>
              <th scope="col" class="px-4 py-3">상영횟수</th>
              <th scope="col" class="px-4 py-3">누적 관객수</th>
              <th scope="col" class="px-4 py-3">누적 매출액</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in recent7DaysBoxoffice" :key="row.target_date" class="bg-white border-b hover:bg-gray-50 transition">
              <td class="px-4 py-3 text-center font-medium text-gray-900 sticky left-0 bg-white z-10 border-r">{{ row.target_date }}</td>
              <td class="px-4 py-3 text-center font-bold">{{ row.rank_num }}위</td>
              
              <td class="px-4 py-3">
                <span class="font-bold text-gray-900">{{ (row.audi_cnt || 0).toLocaleString() }}</span>
                <span class="ml-1 text-xs" :class="row.audi_change_dod > 0 ? 'text-red-500' : 'text-blue-500'">
                  ({{ row.audi_change_dod > 0 ? '+' : '' }}{{ (row.audi_change_dod || 0).toLocaleString() }})
                </span>
              </td>
              
              <td class="px-4 py-3">
                <span class="font-bold text-gray-900">{{ (row.sales_amt || 0).toLocaleString() }}</span>
                <span class="ml-1 text-xs" :class="row.sales_change_dod > 0 ? 'text-red-500' : 'text-blue-500'">
                  ({{ row.sales_change_dod > 0 ? '+' : '' }}{{ (row.sales_change_dod || 0).toLocaleString() }})
                </span>
              </td>
              
              <td class="px-4 py-3 font-bold text-purple-600">{{ row.show_share || 0 }}%</td>
              <td class="px-4 py-3 font-bold text-rose-500">{{ row.seat_sales_rate || 0 }}%</td>
              
              <td class="px-4 py-3">
                {{ (row.screen_cnt || 0).toLocaleString() }}개
                <span class="text-xs text-gray-400 ml-1">({{ row.screen_share || 0 }}%)</span>
              </td>
              
              <td class="px-4 py-3">{{ (row.show_cnt || 0).toLocaleString() }}회</td>
              <td class="px-4 py-3 text-blue-600 font-bold">{{ (row.acc_audi_cnt || 0).toLocaleString() }}</td>
              <td class="px-4 py-3 text-green-600 font-bold">{{ (row.acc_sales_amt || 0).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-8">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-xl font-bold text-gray-950">흥행 추이 (누적 vs 일일 관객)</h3>
          <div class="text-xs text-gray-400 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M.133 11.118l2.897.777M3.088 2.228l1.102-.635m8.045 7.906l.635 1.102m3.949-8.045l-.635 1.102m.747 9.876l9.876.747"></path></svg>
            그래프를 마우스 휠로 확대/축소, 드래그로 이동해 보세요.
          </div>
        </div>
        <MarketingCharts type="mixed" :chartData="trendChartData" :chartOptions="trendChartOptions" />
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold mb-5 text-gray-950">스크린 효율성 분석 (상영점유율 vs 좌석판매율)</h3>
        <MarketingCharts type="line" :chartData="efficiencyChartData" :chartOptions="efficiencyChartOptions" />
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold mb-5 text-gray-950">요일별 관람 패턴 (타겟팅 분석)</h3>
        <MarketingCharts type="bar" :chartData="dowChartData" :chartOptions="dowChartOptions" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api';
import MarketingCharts from '../components/MarketingCharts.vue';

const props = defineProps({ movieCd: String });
const dashboardData = ref(null);
const loading = ref(true);

const dateFrom = ref('');
const dateTo = ref('');

const fetchDashboardData = async (from = null, to = null) => {
  loading.value = true;
  try {
    const data = await api.getDashboard(props.movieCd, from, to);
    dashboardData.value = data;
    
    if (!from && !to && data.boxoffice.length > 0) {
      dateFrom.value = data.boxoffice[0].target_date;
      dateTo.value = data.boxoffice[data.boxoffice.length - 1].target_date;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const applyDateRange = () => {
  if (dateFrom.value && dateTo.value && dateFrom.value > dateTo.value) {
    alert('시작일은 종료일보다 빠를 수 없습니다.');
    return;
  }
  fetchDashboardData(dateFrom.value, dateTo.value);
};

const sortedBoxoffice = computed(() => 
  dashboardData.value?.boxoffice.slice().sort((a, b) => new Date(a.target_date) - new Date(b.target_date)) || []
);
const reversedBoxoffice = computed(() => {
  return [...sortedBoxoffice.value].reverse();
});
// ✨ 템플릿의 테이블에서 이 값을 사용하여 최근 7일치만 렌더링하도록 변경됨
const recent7DaysBoxoffice = computed(() => {
  return reversedBoxoffice.value.slice(0, 7);
});

// ✨ 가장 최근(전일자) 데이터
const latestData = computed(() => sortedBoxoffice.value[sortedBoxoffice.value.length - 1] || {});

const trendChartData = computed(() => ({
  labels: sortedBoxoffice.value.map(d => d.target_date),
  datasets: [
    { type: 'line', label: '누적 관객수', data: sortedBoxoffice.value.map(d => d.acc_audi_cnt), borderColor: '#f59e0b', yAxisID: 'y1', tension: 0.1, pointRadius: 2 },
    { type: 'bar', label: '일일 관객수', data: sortedBoxoffice.value.map(d => d.audi_cnt), backgroundColor: 'rgba(59, 130, 246, 0.7)', yAxisID: 'y', barPercentage: 0.8 }
  ]
}));
const trendChartOptions = {
  responsive: true, maintainAspectRatio: false,
  scales: {
    y: { type: 'linear', position: 'left', title: { display: true, text: '일일 관객' } },
    y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '누적 관객' } }
  }
};

const efficiencyChartData = computed(() => ({
  labels: sortedBoxoffice.value.map(d => d.target_date),
  datasets: [
    { label: '상영 점유율 (%)', data: sortedBoxoffice.value.map(d => d.show_share), borderColor: '#8b5cf6', tension: 0.1, yAxisID: 'y', pointRadius: 2 },
    { label: '좌석 판매율 (%)', data: sortedBoxoffice.value.map(d => d.seat_sales_rate), borderColor: '#ef4444', tension: 0.1, yAxisID: 'y', pointRadius: 2 }
  ]
}));
const efficiencyChartOptions = {
  responsive: true, maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  scales: { y: { type: 'linear', position: 'left', title: { display: true, text: '비율 (%)' }, min: 0, max: 100 } }
};

const dowChartData = computed(() => {
  const sums = [0, 0, 0, 0, 0, 0, 0]; const counts = [0, 0, 0, 0, 0, 0, 0];
  sortedBoxoffice.value.forEach(d => {
    const dayIdx = new Date(d.target_date).getDay(); sums[dayIdx] += d.audi_cnt || 0; counts[dayIdx] += 1;
  });
  const averages = sums.map((sum, idx) => counts[idx] ? Math.round(sum / counts[idx]) : 0);
  return {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [{
      label: '요일별 평균 관객수',
      data: [averages[1], averages[2], averages[3], averages[4], averages[5], averages[6], averages[0]],
      backgroundColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb', '#bfdbfe', '#fecdd3', '#fecdd3'],
      borderRadius: 8
    }]
  };
});
const dowChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    zoom: { zoom: { wheel: { enabled: false }, pinch: { enabled: false } }, pan: { enabled: false } }
  },
  scales: { x: { grid: { display: false } } }
};

onMounted(() => {
  fetchDashboardData(); 
});
</script>