<template>
  <div v-if="loading && !dashboardData" class="flex justify-center py-20 text-blue-500 animate-pulse font-bold">
    마케팅 인사이트를 분석 중입니다... 🍿
  </div>

  <div v-else-if="dashboardData" class="max-w-7xl mx-auto p-6 pb-20 bg-gray-50 min-h-screen">
    
    <div class="flex flex-col md:flex-row gap-10 mb-10 items-start p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <img 
        v-if="dashboardData.movie.poster_url" 
        :src="dashboardData.movie.poster_url" 
        alt="영화 포스터" 
        class="w-full md:w-60 h-auto rounded-2xl shadow-xl object-cover flex-shrink-0"
      />
      <div v-else class="w-full md:w-60 h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0">
        포스터 없음
      </div>

      <div class="flex-1 min-w-0">
        <div class="mb-5">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-gray-950">
            {{ dashboardData.movie.movie_nm }} 
          </h1>
          <p class="text-lg text-gray-500 font-medium">{{ dashboardData.movie.movie_nm_en }}</p>
          <div class="flex flex-wrap gap-2 text-sm mt-4">
            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">개봉: {{ dashboardData.movie.open_dt || '미정' }}</span>
            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">{{ dashboardData.movie.rep_genre_nm }}</span>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-sm font-bold mb-2 text-gray-400 tracking-wider uppercase">줄거리</h3>
          <p class="text-gray-800 leading-relaxed text-[15px] max-h-40 overflow-y-auto pr-2">
            {{ dashboardData.movie.synopsis || '등록된 줄거리가 없습니다.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 border-t border-gray-100 pt-5">
          <p><strong>감독:</strong> {{ dashboardData.directors.map(d => d.person.people_nm).join(', ') || '정보 없음' }} </p>
          <p><strong>주요 배우:</strong> {{ dashboardData.actors.slice(0, 5).map(a => a.person.people_nm).join(', ') || '정보 없음' }}</p>
        </div>
      </div>
    </div>

    <div class="sticky top-4 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200">
      <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        분석 기간 설정
      </h2>
      <div class="flex items-center gap-2">
        <input type="date" v-model="dateFrom" class="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
        <span class="text-gray-400 font-medium">~</span>
        <input type="date" v-model="dateTo" class="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
        <button 
          @click="applyDateRange" 
          class="ml-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '적용 중...' : '적용' }}
        </button>
      </div>
    </div>

    <div class="space-y-8">
      
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-950">흥행 모멘텀 분석 (일일 vs 누적 관객)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">하단 스크롤바를 조절하여 특정 구간의 화제성을 줌인(Zoom-in) 해보세요.</p>
        <div class="w-full h-[400px]">
          <v-chart class="chart" :option="trendChartOption" autoresize />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-950">스크린 마케팅 효율성 (상영점유율 vs 좌석판매율)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          <span class="font-bold text-blue-600">상영점유율</span>이 높은데 <span class="font-bold text-red-500">좌석판매율</span>이 낮다면 스크린 과잉 확보 상태입니다.
        </p>
        <div class="w-full h-[350px]">
          <v-chart class="chart" :option="efficiencyChartOption" autoresize />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-950">프리미엄 포맷 파워 (평균 객단가 추이)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">특정일에 객단가가 상승한다면 <b>IMAX, 4DX 등 특수관 매니아층</b>의 N차 관람이 주도하고 있다는 신호입니다.</p>
        <div class="w-full h-[350px]">
          <v-chart class="chart" :option="arpuChartOption" autoresize />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-950">극장 편성 방어력 (스크린당 상영횟수)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          수치가 <span class="text-red-500 font-bold">3.0 미만</span>으로 떨어지면 극장이 메인 시간대를 뺏고 <b>'교차 상영(조조/심야 배치)'</b>을 시작했다는 의미입니다.
        </p>
        <div class="w-full h-[300px]">
          <v-chart class="chart" :option="crossScreeningChartOption" autoresize />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-gray-950">요일별 관람 패턴 (프로모션 타겟팅)</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">평균 관객이 몰리는 요일을 파악하여 무대인사나 이벤트를 집중 배치하세요.</p>
        <div class="w-full h-[300px]">
          <v-chart class="chart" :option="dowChartOption" autoresize />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api';

// --- ECharts 모듈 임포트 ---
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer, BarChart, LineChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent
]);
// -----------------------------

const props = defineProps({ movieCd: String });
const dashboardData = ref(null);
const loading = ref(true);

const dateFrom = ref('');
const dateTo = ref('');

const fetchDashboardData = async (from = null, to = null) => {
  loading.value = true;
  try {
    const data = await api.getDashboard(props.movieCd, from, to);
    dashboardData.value = data;
    
    if (!from && !to && data.boxoffice.length > 0) {
      dateFrom.value = data.boxoffice[0].target_date;
      dateTo.value = data.boxoffice[data.boxoffice.length - 1].target_date;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const applyDateRange = () => {
  if (dateFrom.value && dateTo.value && dateFrom.value > dateTo.value) {
    alert('시작일은 종료일보다 빠를 수 없습니다.');
    return;
  }
  fetchDashboardData(dateFrom.value, dateTo.value);
};

// 날짜순 정렬된 데이터
const sortedBoxoffice = computed(() => 
  dashboardData.value?.boxoffice.slice().sort((a, b) => new Date(a.target_date) - new Date(b.target_date)) || []
);

// 📊 1. 흥행 추이 차트 옵션 (막대 + 꺾은선 + 줌)
const trendChartOption = computed(() => {
  const dates = sortedBoxoffice.value.map(d => d.target_date);
  const dailyAudi = sortedBoxoffice.value.map(d => d.audi_cnt);
  const accAudi = sortedBoxoffice.value.map(d => d.acc_audi_cnt);

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['일일 관객수', '누적 관객수'], bottom: 0 },
    grid: { left: '3%', right: '3%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: [
      { 
        type: 'value', name: '일일 관객 (명)', 
        axisLabel: { formatter: (val) => (val / 10000).toFixed(0) + '만' } 
      },
      { 
        type: 'value', name: '누적 관객 (명)', 
        alignTicks: true,
        axisLabel: { formatter: (val) => (val / 10000).toFixed(0) + '만' } 
      }
    ],
    // 💡 주식 차트 같은 미니맵 스크롤바
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', bottom: 25, height: 20, borderColor: 'transparent', backgroundColor: '#f3f4f6' }
    ],
    series: [
      { name: '일일 관객수', type: 'bar', data: dailyAudi, itemStyle: { color: '#60a5fa', borderRadius: [4, 4, 0, 0] } },
      { name: '누적 관객수', type: 'line', yAxisIndex: 1, data: accAudi, smooth: true, itemStyle: { color: '#f59e0b' }, lineStyle: { width: 3 } }
    ]
  };
});

// 📊 2. 스크린 마케팅 효율성 차트 (면적 그래프)
const efficiencyChartOption = computed(() => {
  const dates = sortedBoxoffice.value.map(d => d.target_date);
  const showShare = sortedBoxoffice.value.map(d => d.show_share);
  const seatSalesRate = sortedBoxoffice.value.map(d => d.seat_sales_rate);

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    legend: { data: ['상영 점유율 (%)', '좌석 판매율 (%)'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dates },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value} %' } },
    series: [
      { 
        name: '상영 점유율 (%)', type: 'line', data: showShare, smooth: true,
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' } 
      },
      { 
        name: '좌석 판매율 (%)', type: 'line', data: seatSalesRate, smooth: true,
        itemStyle: { color: '#ef4444' },
        areaStyle: { color: 'rgba(239, 68, 68, 0.1)' } 
      }
    ]
  };
});

// 📊 3. 요일별 타겟팅 차트
const dowChartOption = computed(() => {
  const sums = [0, 0, 0, 0, 0, 0, 0]; 
  const counts = [0, 0, 0, 0, 0, 0, 0];
  sortedBoxoffice.value.forEach(d => {
    const dayIdx = new Date(d.target_date).getDay(); 
    sums[dayIdx] += d.audi_cnt || 0; 
    counts[dayIdx] += 1;
  });
  const averages = sums.map((sum, idx) => counts[idx] ? Math.round(sum / counts[idx]) : 0);
  
  // 월화수목금토일 순서 맞추기
  const alignedAverages = [averages[1], averages[2], averages[3], averages[4], averages[5], averages[6], averages[0]];

  return {
    tooltip: { trigger: 'axis', formatter: '{b}요일 평균: {c}명' },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['월', '화', '수', '목', '금', '토', '일'], axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { formatter: (val) => (val / 10000).toFixed(0) + '만' } },
    series: [
      {
        type: 'bar',
        data: alignedAverages.map((val, idx) => ({
          value: val,
          // 주말(토, 일)은 붉은색 계열, 평일은 푸른색 계열로 시각적 분리
          itemStyle: { color: idx >= 5 ? '#f87171' : '#93c5fd', borderRadius: [6, 6, 0, 0] }
        })),
        barWidth: '40%'
      }
    ]
  };
});

// 📊 4. 관객 1인당 평균 결제 금액 (객단가 - ARPU) 차트
const arpuChartOption = computed(() => {
  const dates = sortedBoxoffice.value.map(d => d.target_date);
  // 매출액 / 관객수 = 객단가
  const arpu = sortedBoxoffice.value.map(d => d.audi_cnt > 0 ? Math.round(d.sales_amt / d.audi_cnt) : 0);

  return {
    tooltip: { trigger: 'axis', formatter: '{b}<br/>평균 객단가: <b>{c}원</b>' },
    grid: { left: '4%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: { 
      type: 'value', 
      min: (value) => Math.max(0, value.min - 1000), // 변동성을 잘 보이게 Y축 최소값 자동 조절
      axisLabel: { formatter: '{value}원' } 
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 0, height: 20 }],
    series: [
      {
        name: '객단가',
        type: 'line',
        data: arpu,
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#8b5cf6' }, // 보라색
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(139, 92, 246, 0.4)' }, { offset: 1, color: 'rgba(139, 92, 246, 0.0)' }]
          }
        }
      }
    ]
  };
});

// 📊 5. 극장 편성 퀄리티 (스크린당 상영 횟수 - 교차상영 지수)
const crossScreeningChartOption = computed(() => {
  const dates = sortedBoxoffice.value.map(d => d.target_date);
  // 상영횟수 / 스크린수 = 스크린 1개당 평균 상영 횟수
  const showsPerScreen = sortedBoxoffice.value.map(d => 
    d.screen_cnt > 0 ? (d.show_cnt / d.screen_cnt).toFixed(2) : 0
  );

  return {
    tooltip: { trigger: 'axis', formatter: '{b}<br/>스크린당 상영: <b>{c}회</b>' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: '상영 횟수', splitLine: { lineStyle: { type: 'dashed' } } },
    // 시각적 기준선 (MarkLine): 3.0 이하로 떨어지면 위험 신호
    series: [
      {
        name: '평균 상영횟수',
        type: 'bar',
        data: showsPerScreen,
        itemStyle: {
          // 3회 미만이면 빨간색(경고), 이상이면 청록색(정상)
          color: (params) => params.value < 3.0 ? '#ef4444' : '#14b8a6',
          borderRadius: [4, 4, 0, 0]
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#ef4444', type: 'dashed' },
          data: [{ yAxis: 3.0, name: '교차상영 경고선' }]
        }
      }
    ]
  };
});

onMounted(() => {
  fetchDashboardData(); 
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>