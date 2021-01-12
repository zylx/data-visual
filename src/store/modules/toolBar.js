// import Vue from 'vue'
import { cloneDeep, setLocalStorage } from '@/utils/utils'
// import { message } from 'element-ui'

const toolBar = {
  namespaced: true,
  state: {},
  mutations: {
    // // 撤消
    // undo (state, { snapshotIndex, snapshotData, componentData }) {
    //   if (snapshotIndex > 0) {
    //     snapshotIndex--
    //     componentData = cloneDeep(snapshotData[snapshotIndex])
    //     // 更新快照索引缓存
    //     setLocalStorage('snapshotIndex', snapshotIndex)
    //     // 更新组件缓存
    //     setLocalStorage('componentData', componentData)
    //   }
    // },
    // 撤消
    undo (state, { rootState }) {
      if (rootState.snapshotIndex > 0) {
        rootState.snapshotIndex--
        rootState.componentData = cloneDeep(rootState.snapshotData[rootState.snapshotIndex])
        // 更新快照索引缓存
        setLocalStorage('snapshotIndex', rootState.snapshotIndex)
        // 更新组件缓存
        setLocalStorage('componentData', rootState.componentData)
      }
    },

    // 重做
    redo (state, { rootState }) {
      if (rootState.snapshotIndex < rootState.snapshotData.length - 1) {
        rootState.snapshotIndex++
        rootState.componentData = cloneDeep(rootState.snapshotData[rootState.snapshotIndex])
        // 更新快照索引缓存
        setLocalStorage('snapshotIndex', rootState.snapshotIndex)
        // 更新组件缓存
        setLocalStorage('componentData', rootState.componentData)
      }
    },

    // 上对齐
    alignTop (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 组件的 top 值大于 minTop 时，说明组件需要上移
        if (style.top > payload.minTop) {
          style.top = payload.minTop
        }
      })
      rootState.componentData = componentData
    },

    // 下对齐
    alignBottom (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 组件的 top +  height 值小于 maxBottom 时，说明组件需要下移
        if (style.top + style.height < payload.maxBottom) {
          style.top = payload.maxBottom - style.height
        }
      })
      rootState.componentData = componentData
    },

    // 左对齐
    alignLeft (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 组件的 left 值大于 minLeft 时，说明组件需要左移
        if (style.left > payload.minLeft) {
          style.left = payload.minLeft
        }
      })
      rootState.componentData = componentData
    },

    // 右对齐
    alignRight (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 组件的 left +  width 值小于 maxRight 时，说明组件需要右移
        if (style.left + style.width < payload.maxRight) {
          style.left = payload.maxRight - style.width
        }
      })
      rootState.componentData = componentData
    }

  },

  actions: {
    ...['undo', 'redo', 'alignTop', 'alignBottom', 'alignLeft', 'alignRight'].reduce((prev, cur) => {
      prev[cur] = ({ commit, rootState }, payload = {}) => commit(cur, { rootState, payload })
      return prev
    }, {})
  }

}

export default toolBar