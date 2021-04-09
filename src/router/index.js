import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示访问的路径
  // from 表示从哪个连接跳转
  // next 函数，直接调用表示放行, 带参数表示强制跳转
  if (to.path === '/login') return next();
  // 获取 token
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
});

export default router;
