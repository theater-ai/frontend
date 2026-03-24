<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
    <div class="flex flex-col items-center gap-4">
      <span class="flex items-center gap-1">
        <span class="w-2 h-2 bg-[#999] rounded-full animate-bounce [animation-delay:0s]"></span>
        <span class="w-2 h-2 bg-[#999] rounded-full animate-bounce [animation-delay:0.15s]"></span>
        <span class="w-2 h-2 bg-[#999] rounded-full animate-bounce [animation-delay:0.3s]"></span>
      </span>
      <p class="text-[#666] text-sm">로그인 처리 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  // 백엔드의 실패 핸들러가 ?error=xxx 형태로 보냈는지 확인
  const error = route.query.error

  if (error) {
    console.error('OAuth 로그인 실패:', error)
    alert('로그인에 실패했습니다.')
    router.replace('/login')
    return
  }

  // 에러가 없다면 성공으로 간주 (쿠키는 이미 브라우저에 저장됨)
  authStore.handleAuthSuccess()
  
  // 대시보드로 이동
  router.replace('/dashboard')
})
</script>
