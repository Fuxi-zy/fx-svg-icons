import { createApp } from 'vue'

import { setupIcons } from 'virtual:fx-svg-icon'

import App from './App.vue'

const app = createApp(App)
setupIcons(app)
app.mount('#app')
