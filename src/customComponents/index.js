/**
 * 自动引入组件
 */

// 处理首字母大写 abc => Abc
function changeStr (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  install (Vue) {
    // https://webpack.js.org/guides/dependency-management/#requirecontext
    const components = require.context('./', true, /\.vue$/)

    // 解析自动引入组件
    components.keys().forEach(filePath => {
      const config = components(filePath)
      const componentName = changeStr(
        filePath.replace(/^\.\/(.*)\/\w+\.\w+$/, '$1')
      )
      // console.log(componentName)
      Vue.component(componentName, config.default || config) // 动态注册该目录下的所有.vue文件
    })
  }
}
