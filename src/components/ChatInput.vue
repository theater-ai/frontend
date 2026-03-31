<template>
  <div class="relative w-full shadow-xl rounded-2xl border border-gray-200 bg-white flex flex-col focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-text" @click="focusEditor">
    <div class="px-5 py-4 max-h-40 overflow-y-auto">
      <editor-content :editor="editor" />
    </div>

    <div class="px-3 pb-3 pt-1 flex justify-between items-center mt-auto">
      <div class="text-[11px] font-bold text-blue-500 ml-2">
        💡 @를 입력하여 영화를 태그해보세요! (Shift + Enter로 줄바꿈)
      </div>
      <button 
        @click="submitChat"
        class="p-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!editor || editor.isEmpty"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import suggestion from './suggestion'

const emit = defineEmits(['send'])

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '질문을 입력하세요... (예: @파묘 흥행 기록 어때?)',
      emptyEditorClass: 'is-editor-empty',
    }),
    Mention.configure({
        HTMLAttributes: {
            // 멘션(태그) 뱃지 디자인 - 슬랙 느낌의 파란색 칩
            class: 'inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-md mx-0.5 shadow-sm border border-blue-200 transition-colors',
        },
        suggestion, 
    }),
  ],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none text-[15px] leading-relaxed text-gray-800',
    },
    // 엔터키 처리하는 부분
    handleKeyDown: (view, event) => {
      if (event.key === 'Enter' && !event.shiftKey) {

        const isPopupOpen = document.querySelector('.tippy-box');
        if (isPopupOpen) {
            return false; // 멘션 팝업이 열려있으면 엔터키 이벤트 무시 (팝업 내에서 처리)
        }

        event.preventDefault();
        submitChat();
        return true;
      }
      return false;
    },
  },
})

const focusEditor = () => {
  if (editor.value) editor.value.commands.focus()
}

const submitChat = () => {
  if (!editor.value || editor.value.isEmpty) return;

  // 1. 순수 텍스트 추출 (LLM 전송용)
  const plainText = editor.value.getText();
  
  // 2. 태그된 영화 데이터(멘션) 추출
  // HTML 내부에서 data-type="mention" 인 요소를 찾아 속성을 뽑아냅니다.
  const htmlContent = editor.value.getHTML();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const mentionElements = tempDiv.querySelectorAll('[data-type="mention"]');
  const taggedMovies = Array.from(mentionElements).map(el => ({
    movie_cd: el.getAttribute('data-id'),
    movie_nm: el.getAttribute('data-label')
  }));

  // 3. 부모 컴포넌트(App.vue)로 전송!
  emit('send', {
    text: plainText,
    mentions: taggedMovies
  });

  // 전송 후 에디터 비우기
  editor.value.commands.clearContent();
}

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style>
/* 🎨 Tiptap 에디터 커스텀 스타일 */
/* 플레이스홀더 스타일 */
.is-editor-empty:first-child::before {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

</style>