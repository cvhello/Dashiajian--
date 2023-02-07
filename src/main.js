import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index' // 让elementUI注册的代码参与打包，才能在页面上运行并注册组件

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入dayjs方法
import dayjs from 'dayjs'
// 基于dayjs封装一个全局函数来格式化时间(任意组件可以直接使用$formatDate)
Vue.prototype.$formatDate = (dateObj) => {
  // 借助dayjs内置的方法把日期对象格式化成指定的格式,并把格式化好的字符串返回到调用处
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.use(VueQuillEditor) // 此方法内会用Vue.component注册quillEditor名字全局中间件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 前端
// 1.通过input[type=file]让用户选择文件，通过事件对象.target.files拿到用户选择的"文件对象""
// 预览：img标签的src属性的值(base64字符串/图片链接地址)
//   1.情况1:给src属性赋予base64 data:img/png/base64 图片数据转成base64字符串,特点以data:img/png/base64开头
// 文件转成图片base64字符串:new FileReader()

// 情况2:文件转成图片链接地址:URL.createObjURL(文件)
// 注意:他的地址只能在前端使用

// 需求:把用户选择的文件发给后台保存在服务器上
// 情况1:文件转成图片base64字符串,传递给后台
// 情况2:用new FormDate()表单数据直接装文件本身,直接传递给后台

// 后端返回图片链接地址的经验
// 为何后端返回的图片地址是半截的？
// 原因：因为服务器的域名可能会来回变化，所以数据库里的地址只有相对路径
// 要求：前端请求此图片的时候，后端告诉你图片文件真身所在的服务器域名，前端自己拼接前缀
// 后端就不用去数据库挨个改一遍了

// 项目70
// 积累知识 （报错）
// 组件创建时，会用data里的默认值让template里的标签先渲染一次
// 你的网络请求数据回来，data里变量发生了变化，会让template里使用此变量的地方再次更新dom
// 小问题：第一次渲染的时候没有值可能会导致一些报错，但效果还是出来了

// 解决1：(文章封面)v-if先不让template里会报错的那个代码先屏蔽执行
