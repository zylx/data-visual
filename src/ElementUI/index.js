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
  Button,
  Message,
  MessageBox,
  Popconfirm
} from 'element-ui'

const components = [
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
  Button,
  Popconfirm
]

export default {
  install (Vue) {
    Vue.prototype.$message = Message
    Vue.prototype.$messageBox = MessageBox
    components.forEach((component) => {
      Vue.use(component)
    })
  }
}
