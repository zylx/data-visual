import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    editMode: 'edit', // 编辑器模式 edit read
    canvasStyle: { // 页面全局数据
      width: 1280,
      height: 800,
    },
    componentData: [], // 添加到画布上的组件数据
    curComponent: null,
    curComponentZIndex: null,
  },
  mutations: {
    setEditMode (state, mode) {
      state.editMode = mode
    },

    // 设置画布样式
    setCanvasStyle (state, style) {
      state.canvasStyle = style
    },
    // 拖拽添加组件
    addComponent (state, component) {
      state.componentData.push(component)
    },

    setCurComponent (state, { component, zIndex }) {
      state.curComponent = component
      state.curComponentZIndex = zIndex
    },

    setShapeStyle ({ curComponent }, { top, left, width, height }) {
      top && (curComponent.style.top = top)
      left && (curComponent.style.left = left)
      width && (curComponent.style.width = width)
      height && (curComponent.style.height = height)
      height && (curComponent.style.height = height)
    }

  }
})

export default store