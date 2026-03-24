<template>
  <div class="flex h-screen text-slate-900 font-sans" style="background-color: #f9f9f9;">
    
    <aside 
      :class="['bg-white border-r transition-all duration-300 flex flex-col', isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-none']"
    >
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-bold text-lg">Chat History</h2>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <div v-for="n in 5" :key="n" class="p-3 mb-1 hover:bg-slate-100 rounded-lg cursor-pointer text-sm truncate">
          과거 대화 목록 {{ n }}...
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col relative overflow-hidden">
      
      <header class="h-14 flex items-center px-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 hover:bg-slate-200 rounded-md mr-4">
          <span v-if="isSidebarOpen">⬅️</span>
          <span v-else>➡️</span>
        </button>
        <h1 class="font-semibold text-slate-700">LangGraph Assistant</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-4 md:px-20 lg:px-40 space-y-6">
        <div v-for="(msg, idx) in messages" :key="idx" 
          :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']">
          
          <div :class="[
            'max-w-[80%] p-4 rounded-2xl leading-relaxed',
            msg.role === 'user' 
              ? 'bg-[#F0F0F0] text-slate-800' 
              : 'bg-transparent text-slate-900 border-none'
          ]">
            <div class="text-xs mb-1 opacity-50 font-bold uppercase">{{ msg.role }}</div>
            <div class="whitespace-pre-wrap">{{ msg.content }}</div>
          </div>
        </div>
      </div>

      <footer class="p-4 md:px-20 lg:px-40 bg-transparent">
        <div class="max-w-4xl mx-auto relative bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:border-slate-400 transition-colors">
          <textarea 
            v-model="inputMessage"
            @keyup.enter.exact.prevent="sendMessage"
            placeholder="메시지를 입력하세요..."
            class="w-full p-4 pr-12 bg-transparent border-none focus:ring-0 resize-none max-h-40 overflow-y-auto"
            rows="1"
          ></textarea>
          <button 
            @click="sendMessage"
            class="absolute right-3 bottom-3 p-1.5 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors"
          >
            ⬆️
          </button>
        </div>
        <p class="text-center text-[10px] text-slate-400 mt-2">
          LangGraph UI Mockup - API Ready
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(true);
const inputMessage = ref('');
const messages = ref([
  { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요? LangGraph와 연결될 준비가 되었습니다.' },
]);

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;

  // 유저 메시지 추가
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  });

  const currentInput = inputMessage.value;
  inputMessage.value = '';

  // 향후 API 호출 로직 들어갈 자리 (Mockup 처리)
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `'${currentInput}'에 대한 LangGraph의 응답 예시입니다.`
    });
  }, 600);
};
</script>

<style scoped>
/* 스크롤바 커스텀 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>