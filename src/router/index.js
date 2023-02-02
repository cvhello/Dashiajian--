import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 网页打开第一次默认路由路径就是'/'
    component: () => import('@/views/layout'),
    redirect: '/home', // 会导致路由规则数组再次匹配
    children: [
      // 侧边栏导航，点击会切换路由地址，路由地址靠数据请求回来铺设上去的
      //  所以你的路由规则要配合他保持一致
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar.vue')
      },
      {
        path: 'user-pwd', // 必须用这个值
        component: () => import('@/views/user/userPwd')
      }
    ]
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

const whiteList = ['/login', '/reg']// 白名单
// （无需登录可以访问的路由地址 ）

// 全局前置路由守卫
// 知识点1:浏览器第一次打开项目页面,会触发一次全局前置路由守卫函数
// 知识点2:判断登录与否:有token就证明登陆了,没有token就wei
// 知识点3:next()如果强制切换路由地址,,会不会走路由守卫
router.beforeEach((to, from, next) => {
  console.log(11)
  // console.log(to, from)
  // console.log(1)
  const token = store.state.token
  if (token) {
    // 登陆了
    if (!store.state.userInfo.username) {
      // 你现在本地有token值， 才去请求用户的信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组。 includes(值)，作用：判断值是否在数组里面出现过，出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址，则放行(路由全局前置守卫不会再次触发了，而是匹配路由表，让组件挂载)
      next()
    } else {
      // next() 强制切换到登录路径上
      next('/login')
    }
  }
})

export default router

// 退出登录，重新登录，只走相关组件代码 (异步dom,切换不会导致所有代码重新执行，APP.vue不走)
// 效果不对 ：换个账号他得重新请求用户数据呀
// 解决:
// 1.可以在登陆页面 登录成功后，再发送请求拿到用户信息
// 2.可以在全局前置路由守卫中，写（路由跳转的时候 判断+获取）
