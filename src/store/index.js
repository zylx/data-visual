import Vue from 'vue'
import Vuex from 'vuex'
import { cloneDeep, swap } from '@/utils/utils'
import { message } from 'element-ui'

Vue.use(Vuex)

// 编辑器中的组件数据缓存
const componentDataCache  = JSON.parse(localStorage.getItem('componentData')) || []
// 编辑器快照数据缓存
const snapshotDataCache  = JSON.parse(localStorage.getItem('snapshotData')) || []
// 编辑器快照数据索引缓存
const snapshotIndexCache  = parseInt(localStorage.getItem('snapshotIndex')) || -1

const store = new Vuex.Store({
  state: {
    editMode: 'edit', // 编辑器模式 edit read
    editorNode: null, // 编辑器节点
    canvasStyle: { // 页面全局数据
      width: 1280,
      height: 800,
    },
    selectBoxStyle: { // 拖拽选框样式
      display: 'none',
      left: 0,
      top: 0,
      width: 0,
      height: 0
    },
    componentData: componentDataCache, // 编辑器中的组件数据
    selectedComponents: [], // 鼠标拖拽选框时，被选中的组件
    curComponent: null,
    curComponentZIndex: null,
    snapshotData: snapshotDataCache, // 保存编辑器快照数据
    snapshotIndex: snapshotIndexCache, // 快照索引
    menuLeft: 0, // 右键菜单相对于编辑器原点的 X 坐标
    menuTop: 0, // 右键菜单相对于编辑器原点的 Y 坐标
    menuShow: false, // 右键菜单是否显示
  },
  getters: {
    undoEnable: state => state.snapshotIndex > 0 ? true : false, // 撤消按钮是否可用
    redoEnable: state => state.snapshotIndex < state.snapshotData.length - 1 ? true : false // 重做按钮是否可用
  },
  mutations: {
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
    setShapeStyle ({ curComponent }, { top, left, width, height }) {
      top && (curComponent.style.top = top)
      left && (curComponent.style.left = left)
      width && (curComponent.style.width = width)
      height && (curComponent.style.height = height)
    },

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

    // 撤消
    undo (state) {
      if (state.snapshotIndex > 0) {
        state.snapshotIndex--
        store.commit('setComponentData', cloneDeep(state.snapshotData[state.snapshotIndex]))
        // 更新快照索引缓存
        localStorage.setItem('snapshotIndex', state.snapshotIndex)
      }
    },

    // 重做
    redo (state) {
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++
        store.commit('setComponentData', cloneDeep(state.snapshotData[state.snapshotIndex]))
        // 更新快照索引缓存
        localStorage.setItem('snapshotIndex', state.snapshotIndex)
      }
    },

    // 设置（更新）画布中组件信息
    setComponentData (state, componentData = []) {
      Vue.set(state, 'componentData', componentData)
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
      localStorage.setItem('componentData', JSON.stringify(state.componentData))
      // 更新快照缓存
      localStorage.setItem('snapshotIndex', state.snapshotData.length - 1)
      localStorage.setItem('snapshotData', JSON.stringify(state.snapshotData))
    },

    // 显示右键菜单
    showContexeMenu (state, { top, left }) {
      state.menuShow = true
      state.menuTop = top
      state.menuLeft = left + 10
    },

    // 隐藏右键菜单
    hideContexeMenu (state) {
      state.menuShow = false
    },

    // 删除组件
    deleteComponent (state) {
      state.componentData.splice(state.curComponentZIndex, 1)
    },

    // 上移组件
    upComponent ({ componentData, curComponentZIndex }) {
      // 上移图层 zIndex，表示元素在数组中越往后
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, curComponentZIndex + 1)
      } else {
        message.success('已经到顶了')
      }
    },

    // 下移组件
    downComponent ({ componentData, curComponentZIndex }) {
      // 下移图层 zIndex，表示元素在数组中越往前
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, curComponentZIndex - 1)
      } else {
        message.success('已经到底了')
      }
    },

    // 置顶组件
    topComponent ({ componentData, curComponentZIndex }) {
      // 置顶
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, componentData.length - 1)
      } else {
        message.success('已经置顶了')
      }
    },

    // 置底组件
    bottomComponent ({ componentData, curComponentZIndex }) {
      // 置底
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, 0)
      } else {
        message.success('已经置底了')
      }
    }

  }
})

export default store