// ./src/components/suggestion.js
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from './MentionList.vue'
import { api } from '../api'

export default {
  // @ 뒤에 입력된 텍스트(query)를 받아 백엔드 API를 찌릅니다.
  items: async ({ query }) => {
    if (query.length < 1) return []; // 1글자 이상일 때만 검색
    try {
      const data = await api.suggest(query);
      // Tiptap 멘션은 id와 label 속성을 필수로 요구하므로 매핑해줍니다.
      return data.suggestions.slice(0, 5).map(item => ({
        id: item.movie_cd,
        label: item.movie_nm,
        ...item // 추가 정보 (감독, 년도 등)도 함께 넘김
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // 팝업 렌더링 로직 (Tippy.js 사용)
  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) return

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
        })
      },
      onUpdate(props) {
        component.updateProps(props)
        if (!props.clientRect) return
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}