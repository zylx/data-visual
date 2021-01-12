import { swap } from '@/utils/utils'
import { message } from 'element-ui'

const contextMenu = {
  namespaced: true,
  state: {
    menuLeft: 0, // 右键菜单相对于编辑器原点的 X 坐标
    menuTop: 0, // 右键菜单相对于编辑器原点的 Y 坐标
    menuShow: false // 右键菜单是否显示
  },
  mutations: {
    // 显示右键菜单
    showContextMenu (state, { top, left }) {
      state.menuShow = true
      state.menuTop = top
      state.menuLeft = left + 10
    },

    // 隐藏右键菜单
    hideContextMenu (state) {
      state.menuShow = false
    },

    // 删除组件
    deleteComponent (state, { componentData, curComponentZIndex }) {
      componentData.splice(curComponentZIndex, 1)
    },

    // 上移组件
    upComponent (state, { componentData, curComponentZIndex }) {
      // 上移图层 zIndex，表示元素在数组中越往后
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, curComponentZIndex + 1)
      } else {
        message.success('已经到顶了')
      }
    },

    // 下移组件
    downComponent (state, { componentData, curComponentZIndex }) {
      // 下移图层 zIndex，表示元素在数组中越往前
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, curComponentZIndex - 1)
      } else {
        message.success('已经到底了')
      }
    },

    // 置顶组件
    topComponent (state, { componentData, curComponentZIndex }) {
      // 置顶
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, componentData.length - 1)
      } else {
        message.success('已经置顶了')
      }
    },

    // 置底组件
    bottomComponent (state, { componentData, curComponentZIndex }) {
      // 置底
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, 0)
      } else {
        message.success('已经置底了')
      }
    }
  },

  actions: {
    // 显示右键菜单
    showContextMenu ({ commit }, { top, left }) {
      commit('showContextMenu', { top, left })
    },

    // 隐藏右键菜单
    hideContextMenu ({ commit }) {
      commit('hideContextMenu')
    },

    ...['deleteComponent', 'upComponent', 'downComponent', 'topComponent', 'bottomComponent'].reduce((prev, cur) => {
      prev[cur] = ({ commit, rootState }) => commit(cur, {
        componentData: rootState.componentData,
        curComponentZIndex: rootState.curComponentZIndex
      })
      return prev
    }, {})

  }
}

export default contextMenu