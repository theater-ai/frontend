<template>
  <div class="relative w-full h-[450px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <button 
      v-if="isZoomed && !disableZoom"
      @click="resetZoom"
      class="absolute top-4 right-4 z-10 px-3 py-1 text-xs bg-gray-800 text-white rounded-md opacity-80 hover:opacity-100 transition"
    >
      줌 리셋 ↺
    </button>

    <Bar v-if="type === 'bar' || type === 'mixed'" ref="chartRef" :data="chartData" :options="finalOptions" />
    <Line v-else-if="type === 'line'" ref="chartRef" :data="chartData" :options="finalOptions" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement,
  CategoryScale, LinearScale, BarElement, Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  Title, Tooltip, Legend, LineElement, PointElement, 
  CategoryScale, LinearScale, BarElement, Filler, zoomPlugin
);

const props = defineProps({
  type: { type: String, default: 'line' },
  chartData: { type: Object, required: true },
  chartOptions: { type: Object, required: true },
  disableZoom: { type: Boolean, default: false } // 추가: 줌 비활성화 옵션
});

const chartRef = ref(null);
const isZoomed = ref(false);

const resetZoom = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.resetZoom();
    isZoomed.value = false;
  }
};

const finalOptions = computed(() => {
  const base = { ...props.chartOptions };
  if (!base.plugins) base.plugins = {};

  // disableZoom이 true면 줌 플러그인 설정을 건너뜀
  if (!props.disableZoom) {
    base.plugins.zoom = {
      pan: { enabled: true, mode: 'x' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'x',
        onZoom: () => { isZoomed.value = true; },
        onPan: () => { isZoomed.value = true; }
      },
    };
  } else {
    base.plugins.zoom = false;
  }

  base.interaction = { mode: 'index', intersect: false };
  return base;
});
</script>