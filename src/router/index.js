import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    // :movieCd는 동적 파라미터로, 특정 영화의 고유 코드를 URL로 받음
    // 예: /dashboard/20240001
    path: '/dashboard/:movieCd',
    name: 'Dashboard',
    component: DashboardView,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router