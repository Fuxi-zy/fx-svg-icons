import { createApp } from 'vue'
import naive from 'naive-ui'

import { setupIcons } from 'virtual:fx-svg-icon'

import App from './App.vue'

const app = createApp(App)
app.use(naive)
setupIcons(app)
app.mount('#app')
