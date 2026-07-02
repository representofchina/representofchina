import { createApp } from 'vue'
import router from './router.js'
import App from './App.js'
import { init } from './api.js'

init().finally(() => {
  createApp(App).use(router).mount('#app')
})
