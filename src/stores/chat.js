import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { api } from '../api'

export const useChatStore = defineStore('chat', () => {
  const savedSessions = JSON.parse(localStorage.getItem('chat_sessions') || '[]')
  const sessions = ref(savedSessions)
  const currentSessionId = ref(localStorage.getItem('current_session_id') || null)

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: `분석 리포트 ${sessions.value.length + 1}`,
      messages: [{ role: 'assistant', content: '새로운 분석 세션입니다. 무엇을 도와드릴까요?' }]
    }

    if (sessions.value.length >= 5) sessions.value.shift();
    sessions.value.push(newSession)
    currentSessionId.value = newSession.id
  }

  if (sessions.value.length === 0) createNewSession()
  else if (!currentSessionId.value) currentSessionId.value = sessions.value[sessions.value.length - 1].id

  watch(sessions, (newVal) => localStorage.setItem('chat_sessions', JSON.stringify(newVal)), { deep: true })
  watch(currentSessionId, (newVal) => localStorage.setItem('current_session_id', newVal))

  const currentSession = () => sessions.value.find(s => s.id === currentSessionId.value)

  const deleteSession = (id) => {
    sessions.value = sessions.value.filter(s => s.id !== id)
    if (currentSessionId.value === id && sessions.value.length > 0) {
      currentSessionId.value = sessions.value[sessions.value.length - 1].id
    } else if (sessions.value.length === 0) {
      createNewSession()
    }
  }

  // 메시지 전송 로직
  const sendMessage = async (text) => {
    const session = currentSession();
    if (!session) return;

    // 1. 사용자 메시지를 화면에 즉시 반영 (Optimistic UI)
    session.messages.push({ role: 'user', content: text });

    try {
      // 2. 로딩 상태를 보여주기 위해 임시 메시지 추가 (선택사항)
      session.messages.push({ role: 'assistant', content: '생각 중...', isTyping: true });

      // 3. 백엔드 API 호출
      const result = await api.sendChatMessage(session.id, text);

      // 4. 로딩 메시지를 실제 답변으로 교체
      session.messages.pop(); 
      session.messages.push({ role: 'assistant', content: result.content });
      
    } catch (error) {
      console.error(error);
      session.messages.pop(); // 로딩 메시지 제거
      session.messages.push({ role: 'assistant', content: '서버와 연결할 수 없습니다. 다시 시도해 주세요.' });
    }
  }

  return { sessions, currentSessionId, createNewSession, deleteSession, currentSession, sendMessage }
})