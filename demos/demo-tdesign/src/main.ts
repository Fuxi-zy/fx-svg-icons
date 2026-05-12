import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

import { setupIcons } from 'virtual:fx-svg-icon'

import App from './App.vue'

const app = createApp(App)
app.use(TDesign)
setupIcons(app)
app.mount('#app')
