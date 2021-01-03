import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

import '@/styles/reset.css'

import ElementUIComponents from './ElementUI' // 按需引入 eLement-ui 组件
import customComponents from '@/customComponents' // 引入左侧组件列表

Vue.config.productionTip = false

Vue.use(ElementUIComponents)
Vue.use(customComponents)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
