import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局样式
import './assets/styles.css'

const app = createApp(App)

// 使用 Element Plus
app.use(ElementPlus)

// 使用路由
app.use(router)

app.mount('#app')
