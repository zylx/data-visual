import Vue from 'vue'
import { setLocalStorage, cloneDeep } from '@/utils/utils'

const mutations = {
  setEditMode (state, mode) {
    state.editMode = mode
  },

  setEditorNode (state, node) {
    state.editorNode = node
  },

  // 设置画布样式
  setCanvasStyle (state, style) {
    state.canvasStyle = style
  },

  // 拖拽添加组件
  addComponent (state, component) {
    state.componentData.push(component)
  },

  // 更新选中的组件
  setSelectedComponents (state, components) {
    state.selectedComponents = components
  },

  // 设置当前组件信息
  setCurComponent (state, { component, zIndex }) {
    state.curComponent = component
    state.curComponentZIndex = zIndex
  },

  // 修改当前组件样式
  // setShapeStyle ({ curComponent }, { top, left, width, height }) {
  //   top && (curComponent.style.top = top)
  //   left && (curComponent.style.left = left)
  //   width && (curComponent.style.width = width)
  //   height && (curComponent.style.height = height)
  // },

  setShapePosStyle ({ curComponent }, { key, value }) {
    curComponent.style[key] = value
  },

  // 更新 selectBox 位置及宽高
  setSelectBoxStyle (state, style) {
    const result = {
      display: style.display || 'none',
      width: style.width || 0,
      height: style.height || 0,
      left: style.left || 0,
      top: style.top || 0,
    }
    state.selectBoxStyle = result
  },

  // 设置（更新）画布中组件信息
  setComponentData (state, componentData = []) {
    Vue.set(state, 'componentData', componentData)
    // 更新组件缓存
    setLocalStorage('componentData', componentData)
  },

  // 记录操作步骤快照
  recordSnapshot (state) {
    // 添加新的快照
    state.snapshotData[++state.snapshotIndex] = cloneDeep(state.componentData)
    // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
    if (state.snapshotIndex < state.snapshotData.length - 1) {
      state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
    }
    // 更新组件缓存
    setLocalStorage('componentData', state.componentData)
    // 更新快照缓存
    setLocalStorage('snapshotIndex', state.snapshotData.length - 1)
    setLocalStorage('snapshotData', state.snapshotData)
  }

}

export default mutations