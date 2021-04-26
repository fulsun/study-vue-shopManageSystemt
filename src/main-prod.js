import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入 axios 依赖
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import { formatDate } from './assets/js/data.js'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Vue.use(ZkTable)
Vue.component('tree-table', ZkTable)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 配置 this.$http 指向 axios
Vue.prototype.$http = axios
// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use((config) => {
  // NProgress.start()
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
axios.interceptors.response.use((config) => {
  // NProgress.done()
  // 在最后必须 return config
  return config
})
Vue.filter('formatDate', formatDate)
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

// 在路由请求之前之后展示进度条
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
