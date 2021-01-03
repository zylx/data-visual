import {
  Row,
  Col,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  ColorPicker,
  Button
} from 'element-ui'

const components = {
  Row,
  Col,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  ColorPicker,
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
