import Vue from 'vue'
import Vuex from 'vuex'
import { cloneDeep } from '@/utils/utils'

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
    snapshotData: [], // 保存编辑器快照数据
    snapshotIndex: -1, // 快照索引
    undoEnable: false, // 撤消按钮是否可用
    redoEnable: false // 重做按钮是否可用
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
    },

    undo (state) {
      console.log('undo')
      if (state.snapshotIndex >= 0) {
        state.undoEnable = true
        state.redoEnable = true
        state.snapshotIndex--
        store.commit('setComponentData', cloneDeep(state.snapshotData[state.snapshotIndex]))
      } else {
        state.undoEnable =  false
      }
    },

    redo (state) {
      console.log('redo')
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.undoEnable = true
        state.redoEnable = true
        state.snapshotIndex++
        store.commit('setComponentData', cloneDeep(state.snapshotData[state.snapshotIndex]))
      } else {
        state.redoEnable = false
      }
    },

    setComponentData (state, componentData = []) {
      Vue.set(state, 'componentData', componentData)
    },

    recordSnapshot (state) {
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = cloneDeep(state.componentData)
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
      }
      state.undoEnable = true
      state.redoEnable = true
    }

  }
})

export default store