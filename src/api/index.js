//  封装的是具体的接口请求方法
//  注意： 每个方法只负责请求一个url地址
import request from '@/utils/request' // 引入自定义函数

// registerAPI(this.form)
// registerAPI({
// username:'',
// password: '',
// repassword: ''
// })
// 形参obj的值
// 左侧想要解构赋值（语法？）
// obj={username:'',password:'值',repassword:''}
// {username:'username变量名',password: '变量名',repassword: '变量名' }={ username:'',password: '',repassword: '' }
// 函数形参的obj就改成对象结解构接受传入的数据对象
// {username:username,password: password,repassword:repassword}
// key是传入的对象key匹配，value是变量名，用于接受外面传入的值
// es6规定，key和value变量同名的时候，可以简写（key即是key 也是value的变量名）

// 导出接口方法，为了在逻辑页面引入后调用
export const registerAPI = ({ username, password, repassword }) => {
  // 原地是一个Promise对象 （内部包含原生ajax请求）
  // return 这个PRomise对象到逻辑页面，去那边对Promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    // axios 传参params，data
    // arams的对象参数名和值，axios源码会把参数和值，拼接在url?后面给后台
    // data的对象参数名和值，axios源码会把参数和值，拼接在请求体里（body参数）
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: '用户名', password: '密码'}
 * @returns  Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}
