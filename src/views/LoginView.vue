<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
    <div class="bg-white rounded-2xl border border-[#e8e8e5] px-10 py-12 w-full max-w-sm flex flex-col gap-7">

      <!-- 로고 -->
      <div class="flex items-center gap-2.5">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#111"/>
          <path d="M8 16L14 22L24 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 class="text-lg font-semibold text-[#111] tracking-tight">Theater AI</h1>
      </div>

      <!-- 헤딩 -->
      <div>
        <h2 class="text-2xl font-semibold text-[#111] tracking-tight mb-1.5">시작하기</h2>
        <p class="text-sm text-[#888]">계정으로 로그인하여 계속하세요</p>
      </div>

      <!-- 구글 로그인 버튼 -->
      <button
        @click="loginWithGoogle"
        :disabled="loading"
        class="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-white border border-[#e0e0dc] rounded-xl text-sm font-medium text-[#333] cursor-pointer transition-colors duration-150 hover:bg-[#f9f9f7] hover:border-[#ccc] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <template v-if="!loading">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Google로 계속하기
        </template>

        <template v-else>
          <span class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce [animation-delay:0s]"></span>
            <span class="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span class="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce [animation-delay:0.3s]"></span>
          </span>
        </template>
      </button>

      <!-- 약관 -->
      <p class="text-xs text-[#aaa] text-center leading-relaxed">
        계속하면
        <a href="#" class="text-[#666] underline underline-offset-2">이용약관</a>
        및
        <a href="#" class="text-[#666] underline underline-offset-2">개인정보처리방침</a>에
        동의하는 것으로 간주됩니다
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const loginWithGoogle = () => {
  loading.value = true
  // 페이지가 이동되므로 try-catch가 불필요합니다.
  authStore.loginWithGoogle()
}
</script>
