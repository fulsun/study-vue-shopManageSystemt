import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users'
// import Rights from '../components/power/rights'
// import Roles from '../components/power/Roles'
// import Categories from '../components/goods/Categories'
// import Params from '../components/goods/Params'
// import Goods from '../components/goods/List'
// import Add from '../components/goods/Add'
// import Edit from '../components/goods/Edit'
// import Order from '../components/order/Order'
// import Report from '../components/report/Report'

// 路由懒加载
const Login = () => import('@/components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/rights')
const Roles = () => import('../components/power/Roles')
const Categories = () => import('../components/goods/Categories')
const Params = () => import('../components/goods/Params')
const Goods = () => import('../components/goods/List')
const Add = () => import('../components/goods/Add')
const Edit = () => import('../components/goods/Edit')
const Order = () => import('../components/order/Order')
const Report = () => import('../components/report/Report')

Vue.use(VueRouter)

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
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/goods/edit/*',
        component: Edit
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示访问的路径
  // from 表示从哪个连接跳转
  // next 函数，直接调用表示放行, 带参数表示强制跳转
  if (to.path === '/login') return next()
  // 获取 token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
