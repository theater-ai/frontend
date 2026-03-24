import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 쿠키는 JS로 접근이 불가능하므로, 로그인 상태 플래그만 관리
  const isAuthenticated = ref(localStorage.getItem('isLoggedIn') === 'true')
  const user = ref(null)

  // 구글 OAuth 로그인 진입
  const loginWithGoogle = () => {
    // 실제 백엔드 OAuth 진입점으로 브라우저를 이동시킵니다.
    // .env에 VITE_API_URL이 없다면 기본값 8080 포트를 사용합니다.
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    window.location.href = `${apiUrl}/oauth2/authorization/google`
  }

  // 콜백 페이지에서 호출할 로그인 성공 처리 로직
  const handleAuthSuccess = () => {
    isAuthenticated.value = true
    localStorage.setItem('isLoggedIn', 'true')
  }

  // 로그아웃
  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      // 백엔드의 로그아웃 엔드포인트 호출하여 쿠키 삭제 (중요: credentials 포함)
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include' 
      })
    } catch (error) {
      console.error('로그아웃 에러:', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      localStorage.removeItem('isLoggedIn')
      window.location.href = '/login'
    }
  }

  return { user, isAuthenticated, loginWithGoogle, handleAuthSuccess, logout }
})