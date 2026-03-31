<template>
  <div class="h-screen w-screen bg-white text-gray-900 font-sans flex overflow-hidden">
    
    <aside 
      :class="[
        'bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 z-20 shrink-0',
        isSidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'
      ]"
    >
      <div class="p-4 w-64">
        <button class="w-full py-2.5 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          새로운 분석 시작
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1 w-64">
        <div class="text-[11px] font-bold text-gray-400 mb-3 px-2">최근 분석 내역</div>
        <div class="px-3 py-2 text-sm text-gray-700 bg-gray-200/50 rounded-lg cursor-pointer font-medium truncate border border-gray-200/50">
          🎬 파묘 vs 서울의 봄 분석
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col relative bg-white min-w-[400px]">
      
      <header class="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white/90 backdrop-blur-sm absolute top-0 w-full z-40">
        <button 
          @click="isSidebarOpen = !isSidebarOpen" 
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="메뉴 열기/닫기"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <span class="text-xl">🎬</span>
          <span class="font-black text-gray-800 tracking-tight">AI Movie Analyst</span>
        </div>

        <button 
          @click="isDashboardOpen = !isDashboardOpen" 
          :class="[
            'p-2 rounded-lg transition-all flex items-center justify-center',
            isDashboardOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
          ]"
          title="리포트 열기/닫기"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </button>
      </header>

    <div class="flex-1 overflow-y-auto px-4 sm:px-10 pt-20 pb-48">
        <div class="max-w-3xl mx-auto flex flex-col gap-8">
          
          <div 
            v-for="(msg, index) in chatStore.currentSession()?.messages" 
            :key="index" 
            class="flex gap-4"
            :class="msg.role === 'user' ? 'flex-row-reverse' : ''"
          >
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
              :class="msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'"
            >
              {{ msg.role === 'user' ? '👤' : '🤖' }}
            </div>
            
            <div class="flex flex-col gap-2 max-w-[80%]" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
              <span class="text-sm font-bold text-gray-800">
                {{ msg.role === 'user' ? '나' : 'AI 비서' }}
              </span>
              <div 
                class="p-4 rounded-2xl"
                :class="[
                  msg.role === 'user' ? 'bg-gray-900 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm',
                  msg.isTyping ? 'animate-pulse' : ''
                ]"
              >
                <p class="text-[15px] leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
        <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pb-8">
          <div class="max-w-3xl mx-auto">
            <ChatInput @send="handleSendMessage" />
          </div>
      </div>
      </div>
    </main>

    <div 
      v-show="isDashboardOpen"
      @mousedown="startDrag"
      class="w-1.5 hover:w-2 bg-gray-100 hover:bg-blue-400 cursor-col-resize transition-colors z-40 shrink-0"
      title="드래그하여 크기 조절"
    ></div>

    <aside 
      :class="[
        'bg-white shadow-2xl flex flex-col relative z-30 shrink-0 border-l border-gray-200'
      ]"
      :style="{
        width: isDashboardOpen ? `${dashboardWidth}px` : '0px',
        opacity: isDashboardOpen ? 1 : 0,
        transition: isDragging ? 'none' : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out'
      }"
    >
      <div class="flex-1 overflow-y-auto bg-gray-50 relative min-w-[400px] pt-14">
        
        <div class="px-6 py-4 border-b border-gray-100 bg-white/50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Visualization Report Content
        </div>

        <router-view />
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatInput from './components/ChatInput.vue';
import { useChatStore } from './stores/chat';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();

const isSidebarOpen = ref(true); 
const isDashboardOpen = ref(false); 
const dashboardWidth = ref(800); 
const isDragging = ref(false);

watch(() => route.path, (newPath) => {
  if (newPath.includes('/dashboard') || newPath.includes('/compare')) {
    isDashboardOpen.value = true;
  } else if (newPath === '/') {
    isDashboardOpen.value = false;
  }
}, { immediate: true });

const closeDashboard = () => {
  isDashboardOpen.value = false;
};

const goHome = () => {
  isDashboardOpen.value = false;
  router.push('/');
};

const startDrag = (e) => {
  isDragging.value = true;
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  let newWidth = window.innerWidth - e.clientX;
  if (newWidth < 400) newWidth = 400;
  if (newWidth > window.innerWidth - 400) newWidth = window.innerWidth - 400;
  dashboardWidth.value = newWidth;
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});

const handleSendMessage = async (payload) => {
  console.log('🚀 백엔드로 보낼 데이터:', payload);
  
  // 1. 백엔드로 텍스트 전송
  await chatStore.sendMessage(payload.text);

  // 2. 멘션된 영화가 있다면 대시보드도 함께 열기
  if(payload.mentions.length > 0) {
     router.push(`/dashboard/${payload.mentions[0].movie_cd}`);
  }
};
</script>