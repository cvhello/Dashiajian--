// 基于axios封装，网络请求的函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// axios.create()创建一个带配置项的自定义的axios函数
// myAxios 请求的时候，地址baseURL+url
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 定义请求拦截器
// api里每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(function (config) {
  // config配置对象(要请求后台的参数都在这个对象上)
  // 在请求前会触发一次,这个return交给axios源码内,根据配置项发起请求
  // 他返回给axios内源码,config配置对象(要求后台的参数都在这个对象上)

  // 在发起时,统一携带请求头Authorization和token值,
  // 判断 登陆页面和注册恶魔,vuex里无token 而且登录接口和注册接口也不需要携带接口
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 在请求发起之前的代码，如果有异常报错，会直接进入这里
  // 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error的值)
  // 此函数类似catch函数()里return
  // 口诀:return非Promise对象值,会作为成功的对象,返回给下一个Promise对象(axios留在原地)
  // 口诀:returnPromise对象,这个Promise对象状态,返回给下一个Promise对象
  // Promise.reject() 原地留下一个新的Promise对象(状态为失败)他说Promise的类方法reject()
  return Promise.reject(error)
})

// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 响应http状态码为 2xx或3xxx时触发成功的回调，形参中的 response 是“成功的结果”
  //  return到axios原地Promise对象，作为成功的结果
  return response
}, function (error) {
  console.dir(error)
  // 响应状态码不是4xx 5xx时触发失败的回调，形参中的 error 是“失败的结果”
  //  return到axios原地Promise对象位置，作为失败拒绝的状态（如
  // 果那边用try + catch或者catch函数捕获，可以捕获到我们传递过去的这个error变量的值
  // 去破坏；localStorage里的值，刷新让vuex取出错误的token，导致401
  if (error.response.status === 401) {
    //  本次响应是token过期了
    // 清除vuex里一切，切换到登录页面（被动退出登录页面）
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})

    router.push('/login')

    Message.error('用户信息已经过期')
  }

  return Promise.reject(error)
})

// 导出axios自定义函数
export default myAxios
