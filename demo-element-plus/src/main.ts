import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { setupIcons } from 'virtual:fx-svg-icon'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
setupIcons(app)
app.mount('#app')
