import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  const selectedMovies = ref([]) // { movieCd, movieNm } 형태로 저장

  const addMovie = (movie) => {
    // 중복 추가 방지
    if (!selectedMovies.value.find(m => m.movieCd === movie.movieCd)) {
      if (selectedMovies.value.length < 5) { // 최대 5개 제한
        selectedMovies.value.push(movie)
      } else {
        alert('최대 5개까지만 비교할 수 있습니다.')
      }
    }
  }

  const removeMovie = (movieCd) => {
    selectedMovies.value = selectedMovies.value.filter(m => m.movieCd !== movieCd)
  }

  const clearMovies = () => {
    selectedMovies.value = []
  }

  return { selectedMovies, addMovie, removeMovie, clearMovies }
})