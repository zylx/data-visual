import Vue from 'vue'
import router from './router'
import App from './App.vue'

import '@/styles/reset.css'

import ElementUIComponents from './ElementUI' // 按需引入 eLement-ui 组件

Vue.config.productionTip = false

Vue.use(ElementUIComponents)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
