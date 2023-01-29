// 基于axios封装，网络请求的函数
import axios from 'axios'

// axios.create()创建一个带配置项的自定义的axios函数
// myAxios 请求的时候，地址baseURL+url
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 导出axios自定义函数
export default myAxios
