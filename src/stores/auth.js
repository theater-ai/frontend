import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  // 구글 OAuth 로그인
  const loginWithGoogle = async () => {
    // 실제 구현에서는 백엔드에서 구글 OAuth 인증을 처리하고, 인증이 완료되면 JWT 토큰과 사용자 정보를 반환하도록 해야 합니다.
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`

    // 개발용 mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          name: '홍길동',
          email: 'user@example.com',
          avatar: 'https://via.placeholder.com/40',
        }
        user.value = mockUser
        token.value = 'mock-jwt-token'
        localStorage.setItem('token', token.value)
        resolve(mockUser)
      }, 1000)
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, loginWithGoogle, logout }
})