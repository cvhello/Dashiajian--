const { defineConfig } = require('@vue/cli-service')
// 需要排除的包对象
let externals = {}
// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 如何是生产环境，需要执行以下逻辑
if (isProduction) {
  externals = {
    /**
      * externals 对象属性解析：
      * '包名': '在项目中引入的名字'
      * 以 element-ui 举例 我再 main.js 里是以
      * import ELEMENT from 'element-ui'
      * Vue.use(ELEMENT)
      * 这样引入的，所以我的 externals 的属性值应该是 ELEMENT
      * 一定要去main.js设置
    */
    echarts: 'echarts',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    dayjs: 'dayjs',
    'element-ui': 'ELEMENT',
    'vue-quill-editor': 'VueQuillEditor',
    'vuex-persistedstate': 'createPersistedState'
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  // 影响打包时，index.html引入其他资源的前缀地址
  // ./可以让开发环境和生成环境都可以正常使用
  // 开发环境：'/'
  // 生成环境：'./'
  //  问题：有无代码可以让他自己识别当前运行环境？
  // node里有个内置的环境变量process.env.NODE_ENV
  // process.env.NODE_ENV他会根据你敲击的命令，使用不同的值
  // 解决：
  // 如果你敲击yarn build ，process.env.NODE_ENV的值就是 'production'字符串
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // publicPath: './'
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // name: name,
    externals: externals
    // resolve: {
    //   alias: {
    //     '@': resolve('src')
    //   }
    // }
  }
})

// 我们虽然排除掉了第三方的包
// 打包dist和开发环境都会使用这套配置，并排除掉第三方
// 生产环境，在打包时会议public/index.html作为模板生成/dist/index.html  index.html中引入第三方地址cdn,所有效果ok的
// 开发环境，pub;oc/index.html,也有那些第三方的cdn地址，所有也能正常运行
// 但是第一次速度有点慢，所以开发环境呢我还是想让webpack引入本地的node_modules那些第三方包
// process.env.NODE_ENV 可以根据敲击的命令不同，值也不同，能够一个代码区分不同环境
