<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="relative">
      <input 
        v-model="searchQuery" 
        @input="handleInput"
        @focus="showSuggestions = true"
        type="text" 
        placeholder="비교할 영화를 검색해 담아보세요! (최대 5개)"
        class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
        :disabled="isLoading"
      />
      <div class="absolute inset-y-0 right-6 flex items-center pointer-events-none">
        <svg v-if="!isLoading" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <svg v-else class="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <ul v-if="showSuggestions && suggestions.length > 0 && !isLoading" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
      <li 
        v-for="movie in suggestions" 
        :key="movie.movie_cd"
        @click="selectMovie(movie)"
        class="px-6 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b last:border-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
      >
        <span class="font-bold text-gray-800 text-lg">{{ movie.movie_nm }}</span>
        <span class="text-sm text-gray-500">{{ movie.open_dt ? movie.open_dt.substring(0, 4) : '미개봉' }} | {{ movie.director }}</span>
      </li>
    </ul>

    <div v-if="errorMsg" class="mt-4 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-center">
      {{ errorMsg }}
    </div>

    <div v-if="compareStore.selectedMovies.length > 0" class="mt-6 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-sm font-bold text-gray-500 mb-3">현재 담긴 영화 ({{ compareStore.selectedMovies.length }}/5)</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <div 
          v-for="movie in compareStore.selectedMovies" 
          :key="movie.movieCd"
          class="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-full flex items-center gap-2"
        >
          {{ movie.movieNm }}
          <button @click="compareStore.removeMovie(movie.movieCd)" class="text-blue-400 hover:text-red-500 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
      
      <div class="flex gap-2">
        <button 
          @click="goToCompare"
          class="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-md"
        >
          📈 개봉일 기준 흥행 추이 비교하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import { useCompareStore } from '../stores/compare'; // 👇 Store 가져오기

const router = useRouter();
const compareStore = useCompareStore(); // 👇 Store 인스턴스
const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');

let debounceTimeout = null;

const handleInput = () => {
  errorMsg.value = '';
  if (debounceTimeout) clearTimeout(debounceTimeout);
  if (searchQuery.value.trim().length < 2) {
    suggestions.value = [];
    return;
  }
  debounceTimeout = setTimeout(async () => {
    try {
      const data = await api.suggest(searchQuery.value);
      suggestions.value = data.suggestions || [];
      showSuggestions.value = true;
    } catch (err) {
      console.error(err);
    }
  }, 300);
};

const selectMovie = async (movie) => {
  showSuggestions.value = false;
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    const searchResult = await api.search(movie.movie_nm);
    const existingMovie = searchResult.results.find(m => m.movie_nm === movie.movie_nm);
    let targetMovieCd = '';

    if (existingMovie) {
      targetMovieCd = existingMovie.movie_cd;
    } else {
      const scrapeResult = await api.scrape(movie.movie_nm);
      targetMovieCd = scrapeResult.movie_cd;
    }
    
    // 👇 라우터 이동 대신 Store에 영화 추가
    compareStore.addMovie({
      movieCd: targetMovieCd,
      movieNm: movie.movie_nm
    });
    searchQuery.value = ''; // 검색창 초기화
    
  } catch (error) {
    errorMsg.value = error.message || '데이터를 가져오는 데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// 👇 비교 페이지로 이동하는 함수
const goToCompare = () => {
  router.push('/compare');
};
</script>


<!-- <template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="relative">
      <input 
        v-model="searchQuery" 
        @input="handleInput"
        @focus="showSuggestions = true"
        type="text" 
        placeholder="어떤 영화의 통계가 궁금하신가요? (예: 파묘)"
        class="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
        :disabled="isLoading"
      />
      <div class="absolute inset-y-0 right-6 flex items-center pointer-events-none">
        <svg v-if="!isLoading" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <svg v-else class="w-6 h-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <ul 
      v-if="showSuggestions && suggestions.length > 0 && !isLoading" 
      class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto"
    >
      <li 
        v-for="movie in suggestions" 
        :key="movie.movie_cd"
        @click="selectMovie(movie)"
        class="px-6 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b last:border-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
      >
        <span class="font-bold text-gray-800 text-lg">{{ movie.movie_nm }}</span>
        <span class="text-sm text-gray-500">
          {{ movie.open_dt ? movie.open_dt.substring(0, 4) : '미개봉' }} | {{ movie.director }}
        </span>
      </li>
    </ul>

    <div v-if="errorMsg" class="mt-4 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-center">
      {{ errorMsg }}
    </div>

    <div v-if="isLoading" class="mt-4 text-center text-blue-600 font-medium animate-pulse">
      영화 데이터를 수집하고 분석 중입니다... 잠시만 기다려주세요! 🍿
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';

const router = useRouter();
const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');

let debounceTimeout = null;

// 검색어 입력 처리 (디바운싱 적용)
const handleInput = () => {
  errorMsg.value = ''; // 에러 초기화
  
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (searchQuery.value.trim().length < 2) {
    suggestions.value = [];
    return;
  }

  // 사용자가 타이핑을 멈추고 300ms 후에 API 요청
  debounceTimeout = setTimeout(async () => {
    try {
      const data = await api.suggest(searchQuery.value);
      suggestions.value = data.suggestions || [];
      showSuggestions.value = true;
    } catch (err) {
      console.error(err);
      // 자동완성 에러는 화면에 굳이 크게 띄우지 않고 콘솔에만 남깁니다.
    }
  }, 300);
};

// 영화 선택 시 (데이터 스크래핑 후 대시보드 이동)
const selectMovie = async (movie) => {
  showSuggestions.value = false;
  searchQuery.value = movie.movie_nm;
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    // 1. 우리 DB에 이미 저장된 영화인지 검색 (빠름)
    // 정확한 매칭을 위해 백엔드의 search API 호출
    const searchResult = await api.search(movie.movie_nm);
    
    // 결과 중 이름이 정확히 일치하는 영화가 있는지 확인
    const existingMovie = searchResult.results.find(
      m => m.movie_nm === movie.movie_nm
    );

    let targetMovieCd = '';

    if (existingMovie) {
      // 2-A. DB에 이미 있다면? 스크래핑 생략하고 바로 해당 코드로 대시보드 직행! 🚀
      targetMovieCd = existingMovie.movie_cd;
    } else {
      // 2-B. DB에 없다면? 그때만 무거운 스크래핑 API 호출 🐢
      const scrapeResult = await api.scrape(movie.movie_nm);
      targetMovieCd = scrapeResult.movie_cd;
    }
    
    // 3. 대시보드 화면으로 이동
    router.push({ name: 'Dashboard', params: { movieCd: targetMovieCd } });
    
  } catch (error) {
    errorMsg.value = error.message || '데이터를 가져오는 데 실패했습니다.';
    searchQuery.value = ''; 
  } finally {
    isLoading.value = false;
  }
};
</script>
 -->
