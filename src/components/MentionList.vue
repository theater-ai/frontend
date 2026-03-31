<template>
  <div class="bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden min-w-[240px] max-h-60 overflow-y-auto z-50">
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        class="w-full text-left px-4 py-3 text-sm transition-colors focus:outline-none flex flex-col gap-0.5"
        :class="index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
        @click="selectItem(index)"
      >
        <span class="font-bold">{{ item.label }}</span>
        <span class="text-[11px] text-gray-400" :class="index === selectedIndex ? 'text-blue-400' : ''">
          {{ item.open_dt ? item.open_dt.substring(0, 4) : '미개봉' }} | {{ item.director || '감독 정보 없음' }}
        </span>
      </button>
    </template>
    <div v-else class="px-4 py-3 text-sm text-gray-400 text-center font-medium">
      검색 중이거나 결과가 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  command: { type: Function, required: true },
});

const selectedIndex = ref(0);

// 검색어가 바뀌어 목록이 갱신되면 선택 인덱스 초기화
watch(() => props.items, () => {
  selectedIndex.value = 0;
}, { deep: true });

const selectItem = (index) => {
  const item = props.items[index];
  if (item) {
    // Tiptap 에디터에 태그를 삽입하는 명령 실행 (id와 label 전달)
    props.command({ id: item.id, label: item.label });
  }
};

// suggestion.js에서 호출할 키보드 이벤트 처리 함수
const onKeyDown = ({ event }) => {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value + props.items.length - 1) % Math.max(props.items.length, 1);
    return true;
  }
  if (event.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % Math.max(props.items.length, 1);
    return true;
  }
  if (event.key === 'Enter') {
    selectItem(selectedIndex.value);
    return true;
  }
  return false;
};

// 부모(Tiptap 설정)에서 onKeyDown에 접근할 수 있도록 노출
defineExpose({ onKeyDown });
</script>