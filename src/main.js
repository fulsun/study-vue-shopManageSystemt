import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
// 导入全局样式
import './assets/css/global.css';
// 导入字体图标
import './assets/fonts/iconfont.css';
// 导入 axios 依赖
import axios from 'axios';
import ZkTable from 'vue-table-with-tree-grid';
import { formatDate } from './assets/js/data.js';

// Vue.use(ZkTable)
Vue.component('tree-table', ZkTable);

Vue.config.productionTip = false;
// 配置 this.$http 指向 axios
Vue.prototype.$http = axios;
// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须 return config
  return config;
});
Vue.filter('formatDate', formatDate);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
