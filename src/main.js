import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// css
import '@/assets/css/init.stylus'

// 插件 及 fliter
import '@/plugins/app'
import '@/plugins/iview'

// axios
import '@/api'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
