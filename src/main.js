import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'hammerjs'

const app = createApp(App)

// 앱에 라우터 사용 등록
app.use(router)

// #app 아이디를 가진 DOM 요소에 마운트
app.mount('#app')