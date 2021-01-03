/**
 * 获取和输出所有组件配置信息
 */

// 公共样式
const commonStyle = {
  rotate: '',
  opacity: 1,
}

// https://webpack.js.org/guides/dependency-management/#requirecontext
const components = require.context('./', true, /\.js$/)

// 解析获取组件配置
const componentConfigList = components.keys().reduce((configs, configPath) => {
  if (/\/config.js$/.test(configPath)) {
    const value = components(configPath)
    value.default.style = { ...value.default.style, ...commonStyle } // 合并公共样式
    configs.push(value.default)
  }
  return configs
}, [])

// console.log(componentConfigList)

export default componentConfigList
