import {
  Row,
  Col,
  Button
} from 'element-ui'

const components = {
  Row,
  Col,
  Button
}

export default {
  install (Vue) {
    // Vue.prototype.$message = Message
    // Vue.prototype.$modal = Modal
    Object.keys(components).forEach((key) => {
      Vue.use(components[key])
    })
  }
}
