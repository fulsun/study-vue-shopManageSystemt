import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入 axios 依赖
import axios from 'axios'

Vue.config.productionTip = false
// 配置 this.$http 指向 axios
Vue.prototype.$http = axios
// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
