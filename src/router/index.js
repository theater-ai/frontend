import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Router 설정
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  // 사용자 로그인 상태 정보 확인
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 1. 로그인 필요한 페이지인데 -> 로그인 안 한 상태 -> 로그인 페이지로 이동
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // 2. 비로그인 페이지인데 -> 로그인 한 상태 -> 대시보드로 이동
    next('/dashboard')
  } else {
    // 3. 그 외 -> 정상 이동
    next()
  }
})

export default router