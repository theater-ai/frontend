<template>
  <div class="w-full h-80">
    <Line 
      v-if="chartData.labels.length > 0" 
      :data="chartData" 
      :options="chartOptions" 
    />
    <div v-else class="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg">
      박스오피스 데이터가 없습니다.
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { Line } from 'vue-chartjs';
// Chart.js 핵심 모듈 등록 (필수)
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler // 선 아래 색상 채우기용
} from 'chart.js';

// Chart.js 모듈 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

// 부모 컴포넌트(DashboardView)로부터 boxoffice 데이터 배열을 받습니다.
const props = defineProps({
  boxofficeData: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 백엔드 데이터를 Chart.js 포맷으로 변환 (Computed 사용)
const chartData = computed(() => {
  // 날짜순으로 정렬 (혹시 안 되어 있을까 봐)
  const sortedData = [...props.boxofficeData].sort(
    (a, b) => new Date(a.target_date) - new Date(b.target_date)
  );

  return {
    // X축 레이블: 날짜 (YYYY-MM-DD)
    labels: sortedData.map(d => d.target_date),
    datasets: [
      {
        label: '일별 관객수',
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // 파란색 투명 배경 (Filler)
        borderColor: '#3b82f6', // 파란색 선
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3b82f6',
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3, // 선 곡선화 (0이면 직선)
        fill: true, // 선 아래 색상 채우기
        // Y축 데이터: 관객수
        data: sortedData.map(d => d.audi_cnt)
      }
    ]
  };
});

// 차트 옵션 설정
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // 부모 div 크기에 맞춤
  plugins: {
    legend: {
      display: false // 범례 숨김 (데이터셋이 하나이므로)
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      cornerRadius: 8,
      callbacks: {
        // 툴팁 숫자 포맷팅 (쉼표 추가)
        label: function(context) {
          return context.parsed.y.toLocaleString() + ' 명';
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false // X축 그리드 숨김
      },
      ticks: {
        color: '#9ca3af', // gray-400
        maxRotation: 0, // 글자 회전 방지
        autoSkip: true, // 레이블 겹침 방지
        maxTicksLimit: 10 // 최대 레이블 개수 제한
      }
    },
    y: {
      beginAtZero: true, // 0부터 시작
      border: {
        dash: [4, 4] // 점선축
      },
      grid: {
        color: '#f3f4f6' // gray-100
      },
      ticks: {
        color: '#9ca3af',
        // Y축 숫자 포맷팅 (1000단위 쉼표)
        callback: function(value) {
          return value.toLocaleString();
        }
      }
    }
  }
};
</script>