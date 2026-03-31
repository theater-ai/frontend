<template>
  <div class="max-w-7xl mx-auto p-6 pb-20 bg-gray-50 min-h-screen">
    
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
        📈 박스오피스 흥행 추이 비교
      </h1>
      <button @click="router.push('/')" class="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
        ← 돌아가기
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20 text-blue-500 animate-pulse font-bold text-xl">
      선택한 영화 데이터를 모두 분석 중입니다... 🍿
    </div>

    <div v-else-if="compareStore.selectedMovies.length === 0" class="text-center py-20 bg-white rounded-3xl border border-gray-200">
      <p class="text-gray-500 text-lg mb-4">비교할 영화가 없습니다.</p>
      <button @click="router.push('/')" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">영화 검색하러 가기</button>
    </div>

    <div v-else class="space-y-8">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-2">개봉일 기준 누적 관객수 추이</h3>
        <p class="text-sm text-gray-500 mb-6">하단 스크롤바를 드래그하거나 휠을 굴려 기간을 조절해보세요.</p>
        
        <div class="w-full h-[500px]">
          <v-chart class="chart" :option="chartOptions" autoresize />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import { useCompareStore } from '../stores/compare';

// --- ECharts 모듈 임포트 ---
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);
// -----------------------------

const router = useRouter();
const compareStore = useCompareStore();
const loading = ref(true);

const chartOptions = ref({});

const fetchAndProcessData = async () => {
  if (compareStore.selectedMovies.length === 0) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    // 1. 선택된 모든 영화의 API 병렬 호출
    const promises = compareStore.selectedMovies.map(movie => api.getDashboard(movie.movieCd));
    const dashboards = await Promise.all(promises);

    let maxDays = 0;
    const seriesData = [];
    const legendData = [];

    // 2. 데이터 정규화 (Day 1, Day 2...)
    dashboards.forEach((db, index) => {
      const movieNm = compareStore.selectedMovies[index].movieNm;
      legendData.push(movieNm);

      // 날짜순 정렬 보장
      const sortedBoxoffice = [...db.boxoffice].sort((a, b) => new Date(a.target_date) - new Date(b.target_date));
      
      if (sortedBoxoffice.length > maxDays) {
        maxDays = sortedBoxoffice.length;
      }

      const accAudiData = sortedBoxoffice.map(day => day.acc_audi_cnt); // 누적 관객수 추출

      seriesData.push({
        name: movieNm,
        type: 'line',
        smooth: true,           // 곡선 처리
        symbol: 'none',         // 점(포인트) 숨기기 (깔끔하게 선만 보이게)
        lineStyle: { width: 3 },
        data: accAudiData
      });
    });

    // 3. X축 카테고리 생성 (Day 1 ~ Day N)
    const xAxisData = Array.from({ length: maxDays }, (_, i) => `Day ${i + 1}`);

    // 4. ECharts 옵션 설정
    chartOptions.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: function (params) {
          let tooltip = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;
          params.forEach(param => {
            // 데이터가 없는 날(null)은 표시 생략
            if (param.value !== undefined && param.value !== null) {
              tooltip += `${param.marker} ${param.seriesName}: <b>${param.value.toLocaleString()}명</b><br/>`;
            }
          });
          return tooltip;
        }
      },
      legend: {
        data: legendData,
        top: 0,
        icon: 'circle'
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '12%', // dataZoom을 위한 하단 여백
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value.toLocaleString()
        }
      },
      // 주식 차트 스타일의 미니맵 스크롤바 적용
      dataZoom: [
        {
          type: 'inside', // 마우스 휠 및 드래그 줌
          start: 0,
          end: 100
        },
        {
          type: 'slider', // 하단 스크롤바 UI
          start: 0,
          end: 100,
          bottom: 0,
          height: 24,
          borderColor: '#e5e7eb',
          fillerColor: 'rgba(59, 130, 246, 0.2)', // 슬라이더 채우기 색상
          handleStyle: {
            color: '#3b82f6',
            borderColor: '#fff'
          }
        }
      ],
      series: seriesData
    };

  } catch (error) {
    console.error("데이터 비교 중 에러:", error);
    alert('데이터를 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAndProcessData();
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>