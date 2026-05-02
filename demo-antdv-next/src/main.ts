import { createApp } from 'vue'
import Antd from 'antdv-next'
import 'antdv-next/dist/reset.css'

import { setupIcons } from 'virtual:fx-svg-icon'

import App from './App.vue'

const app = createApp(App)
app.use(Antd)
setupIcons(app)
app.mount('#app')
