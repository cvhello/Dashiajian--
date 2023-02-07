const { defineConfig } = require('@vue/cli-service')
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
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
  // publicPath: './'
})
