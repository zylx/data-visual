import VueEcharts from './index.vue'

const components = [
  VueEcharts
]

export default {
  install (Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  }
}