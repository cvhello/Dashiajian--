import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout')
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    // webpack 提供import函数来路由由懒加载导入组件
    // 路由懒加载，加载页面路由路径切换到/reg,才去加载对应组件代码
    // 好处：让首页加载文件体积更新，打卡更快
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    // 你现在本地有token值， 才去请求用户的信息
    store.dispatch('getUserInfoActions')
  }
  next()
})

export default router

// 退出登录，重新登录，只走相关组件代码 (异步dom,切换不会导致所有代码重新执行，APP.vue不走)
// 效果不对 ：换个账号他得重新请求用户数据呀
// 解决:
// 1.可以在登陆页面 登录成功后，再发送请求拿到用户信息
// 2.可以在全局前置路由守卫中，写（路由跳转的时候 判断+获取）
