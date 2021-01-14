module.exports = {
  // publicPath: process.env.NODE_ENV === "production" ? "/data-visual/" : "/", // 部署生产环境和开发环境下的URL：可对当前环境进行区分
  // lintOnSave: false, // 是否在代码保存时进行eslint检测
  productionSourceMap: true, // 是否在构建生产包时生成sourceMap文件，false将提高构建速度
  devServer: { // webpack-dev-server 相关配置 
    port: 8081, // 端口号
    hotOnly: true, // 取消热更新
    // proxy: { // 使用代理
    //   '/api': {
    //      target: '//api.github.com', // 目标代理服务器地址
    //     changeOrigin: true, // 允许跨域
    //     pathRewrite:{
    //       '^/api': '' // 重写路径，需要设置重写的话，要在后面的调用接口前加上/api来代替target
    //     }
    //   }
    // }
  },
  configureWebpack: {
    // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
    externals: {
      // 'echarts': 'echarts'
    }
  }
}