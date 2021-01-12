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
    },

    // 水平居中对齐
    alignCenterX (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 垂直方向，单个组件的中线与被选组件整体的中线 centerLineY 对齐
        style.top = payload.centerLineY - parseInt(style.height / 2)
      })
      rootState.componentData = componentData
    },

    // 垂直居中对齐
    alignCenterY (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      payload.indexs.forEach(index => {
        const style = componentData[index].style
        // 水平方向，单个组件的中线与被选组件整体的中线 centerLineX 对齐
        style.left = payload.centerLineX - parseInt(style.width / 2)
      })
      rootState.componentData = componentData
    },

    // 水平等距分布
    alignIsometricX (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      // 按照排序结果依次进行移动（头尾组件不动，头部组件需要用来计算第二个组件的偏移量，但可去除最后一个组件）
      payload.indexs.pop()
      payload.indexs.reduce((prev, cur) => {
        console.log('prev: ', prev)
        console.log('cur: ', cur)
        // 上一个组件样式
        const prevStyle = componentData[prev.cIndex].style
        // 下一个组件样式
        const curStyle = componentData[cur.cIndex].style
        // 移动规则：下一个元素的 offsetLeft = (上一个元素的offsetLeft + offsetWidth) + 平均间距
        curStyle.left = (prevStyle.left + prevStyle.width) + payload.averageSpacingX
        return cur
      })
      rootState.componentData = componentData
    },

    // 垂直等距分布
    alignIsometricY (state, { rootState, payload }) {
      const componentData = [...rootState.componentData]
      // 按照排序结果依次进行移动（头尾组件不动，头部组件需要用来计算第二个组件的偏移量，但可去除最后一个组件）
      payload.indexs.pop()
      payload.indexs.reduce((prev, cur) => {
        // 上一个组件样式
        const prevStyle = componentData[prev.cIndex].style
        // 下一个组件样式
        const curStyle = componentData[cur.cIndex].style
        // 移动规则：下一个元素的 offsetTop = (上一个元素的offsetTop + offsetHeight) + 平均间距
        curStyle.top = (prevStyle.top + prevStyle.height) + payload.averageSpacingY
        return cur
      })
      rootState.componentData = componentData
    }

  },

  actions: {
    ...['undo', 'redo', 'alignTop', 'alignBottom', 'alignLeft', 'alignRight', 'alignCenterX', 'alignCenterY', 'alignIsometricX', 'alignIsometricY'].reduce((prev, cur) => {
      prev[cur] = ({ commit, rootState }, payload = {}) => commit(cur, { rootState, payload })
      return prev
    }, {})
  }

}

export default toolBar