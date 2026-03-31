<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
    
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
        Theater AI
      </h1>
      <p class="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
        박스오피스 성적부터 출연진, 날짜별 관객수 추이까지. <br class="hidden md:block" />
        궁금한 영화 제목을 검색하고 상세한 인사이트를 확인해 보세요.
      </p>
    </div>

    <div class="w-full flex justify-center">
      <MovieSearch />
    </div>

    <div class="mt-16 flex gap-4 text-sm font-medium text-gray-400">
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
        KOBIS 기반
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>
        TMDB 메타데이터
      </span>
    </div>

  </div>
</template>

<script setup>
// 작성해둔 MovieSearch 컴포넌트를 불러옵니다.
import MovieSearch from '../components/MovieSearch.vue';
</script>