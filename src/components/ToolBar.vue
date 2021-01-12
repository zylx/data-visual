<template>
  <div class="tool-bar">
    <div class="tool-bar-item">
      <span :class="{ disabled: !canUndo }" @click="undo">
        <icon name="undo" />
      </span>
      <span :class="{ disabled: !canRedo }" @click="redo">
        <icon name="redo" />
      </span>
      <span @click="preview">
        <icon name="yulan" />
      </span>
      <span :class="{ disabled: !canClearCanvas }" @click="clearCanvas">
        <icon name="qingchu" />
      </span>
    </div>
    <div class="tool-bar-item">
      <span @click="alignTop">
        <icon name="shangduiqi" />
      </span>
      <span @click="alignBottom">
        <icon name="xiaduiqi" />
      </span>
      <span @click="alignLeft">
        <icon name="zuoduiqi" />
      </span>
      <span @click="alignRight">
        <icon name="youduiqi" />
      </span>
      <span @click="alignCenterX">
        <icon name="shuipingjuzhongduiqi" />
      </span>
      <span @click="alignCenterY">
        <icon name="chuizhijuzhongduiqi" />
      </span>
      <span @click="alignIsometricX">
        <icon name="shuipingdengjufenbu" />
      </span>
      <span @click="alignIsometricY">
        <icon name="chuizhidengjufenbu" />
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import eventBus from '@/utils/eventBus'
import Icon from '@/components/Icon'
import { setLocalStorage } from '@/utils/utils'

export default {
  nam: 'Home',
  components: { Icon },
  computed: {
    ...mapGetters([
      'componentData',
      'canUndo',
      'canRedo',
      'canClearCanvas'
    ])
  },
  methods: {
    // 撤消
    undo () {
      this.canUndo && this.$store.dispatch('toolBar/undo')
    },

    // 重做
    redo () {
      this.canRedo && this.$store.dispatch('toolBar/redo')
    },

    // 预览
    preview () {
      eventBus.$emit('showPreview')
    },

    // 清屏
    clearCanvas () {
      this.canClearCanvas && this.$messageBox.confirm('画布内容尚未保存，确定要清空吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setComponentData', [])
        // 清空组件缓存
        setLocalStorage('componentData', [])
        // 清空快照缓存
        setLocalStorage('snapshotIndex', - 1)
        setLocalStorage('snapshotData', [])
      }).catch(() => { })
    },

    /** 对齐方式 **/
    // 上对齐，被选中组件中，找出距离编辑器上边框最近的组件，其它组件上边框与它的上边框对齐
    alignTop () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetTop 并转化为数组，再求数组最小值
        const minTop = Math.min.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetTop)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignTop', { minTop, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 下对齐，被选中组件中，找出距离编辑器下边框最近的组件，其它组件下边框与它的下边框对齐
    alignBottom () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetTop + offsetHeight 并转化为数组，再求数组最大值
        const maxBottom = Math.max.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetTop + cur.offsetHeight)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignBottom', { maxBottom, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 左对齐，被选中组件中，找出距离编辑器左边框最近的组件，其它组件左边框与它的左边框对齐
    alignLeft () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetLeft 并转化为数组，再求数组最小值
        const minLeft = Math.min.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetLeft)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignLeft', { minLeft, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 右对齐，被选中组件中，找出距离编辑器右边框最近的组件，其它组件右边框与它的右边框对齐
    alignRight () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetLeft + offsetWidth 并转化为数组，再求数组最大值
        const maxRight = Math.max.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetLeft + cur.offsetWidth)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignRight', { maxRight, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 水平居中对齐，被选中组件中，找出 Y轴 方向最大间距的上下边框，然后取其中线，其它单个组件 Y轴 方向的中线与之对齐
    alignCenterX () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的上边距（offsetTop）和下边距（offsetTop + offsetHeight）分别放入 topBottomObj 对象的对应数组中，再分别求数组的最小、最大值
        const topBottomObj = components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.top.push(cur.offsetTop)
          prev.bottom.push(cur.offsetTop + cur.offsetHeight)
          return prev
        }, { top: [], bottom: [] })
        // 最小上边距
        const minTop = Math.min.apply(null, topBottomObj.top)
        // 最大下边距
        const maxBottom = Math.max.apply(null, topBottomObj.bottom)
        // Y轴方向中线
        const centerLineY = minTop + parseInt((maxBottom - minTop) / 2)
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignCenterX', { centerLineY, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 垂直居中对齐，被选中组件中，找出 X轴 方向最大间距的左右边框，然后取其中线，其它单个组件 X轴 方向的中线与之对齐
    alignCenterY () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的左边距（offsetLeft）和右边距（offsetLeft + offsetWidth）分别放入 leftRightObj 对象的对应数组中，再分别求数组的最小、最大值
        const leftRightObj = components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.left.push(cur.offsetLeft)
          prev.right.push(cur.offsetLeft + cur.offsetWidth)
          return prev
        }, { left: [], right: [] })
        // 最小左边距
        const minLeft = Math.min.apply(null, leftRightObj.left)
        // 最大右边距
        const maxRight = Math.max.apply(null, leftRightObj.right)
        // X轴方向中线
        const centerLineX = minLeft + parseInt((maxRight - minLeft) / 2)
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignCenterY', { centerLineX, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 水平等距分布
    // 1、先获取所有选中组件整体中最左和最右组件的最大间距 X; 
    // 2、再获取整体中组件的平均间距，即 平均间距 = (X - 所有组件宽度之和) / (组件个数 - 1); 
    // 3、然后将所有组件按照 offsetLeft 值进行递增排序; 
    // 4、最后按照排序结果依次进行移动（头尾组件不动），规则为：下一个组件的 offsetLeft = (上一个组件的 offsetLeft + offsetWidth) + 平均间距。
    alignIsometricX () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        let totalOffsetWidth = 0
        const indexs = []
        // 先获取组件的左边距（offsetLeft）和右边距（offsetLeft + offsetWidth）分别放入 leftRightObj 对象的对应数组中，再分别求数组的最小、最大值
        const leftRightObj = components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          // 后面需要对 offsetLeft 值进行递增排序
          indexs.push({
            cIndex: parseInt(cur.getAttribute('index')),
            left: cur.offsetLeft
          })
          totalOffsetWidth += cur.offsetWidth
          prev.left.push(cur.offsetLeft)
          prev.right.push(cur.offsetLeft + cur.offsetWidth)
          return prev
        }, { left: [], right: [] })
        // 最小左边距
        const minLeft = Math.min.apply(null, leftRightObj.left)
        // 最大右边距
        const maxRight = Math.max.apply(null, leftRightObj.right)
        // X轴方向平均间距，平均间距 = (最大间距X - 所有组件宽度之和) / (组件个数 - 1); 
        const averageSpacingX = parseInt(((maxRight - minLeft) - totalOffsetWidth) / (indexs.length - 1))
        // 将所有组件按照 offsetLeft 值进行递增排序
        indexs.sort((a, b) => a.left - b.left)
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignIsometricX', { averageSpacingX, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 垂直等距分布（与水平等距分布逻辑同理）
    alignIsometricY () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        let totalOffsetHeight = 0
        const indexs = []
        // 先获取组件的上边距（offsetTop）和下边距（offsetTop + offsetHeight）分别放入 topBottomObj 对象的对应数组中，再分别求数组的最小、最大值
        const topBottomObj = components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          // 后面需要对 offsetTop 值进行递增排序
          indexs.push({
            cIndex: parseInt(cur.getAttribute('index')),
            top: cur.offsetTop
          })
          totalOffsetHeight += cur.offsetHeight
          prev.top.push(cur.offsetTop)
          prev.bottom.push(cur.offsetTop + cur.offsetHeight)
          return prev
        }, { top: [], bottom: [] })
        // 最小上边距
        const minTop = Math.min.apply(null, topBottomObj.top)
        // 最大下边距
        const maxBottom = Math.max.apply(null, topBottomObj.bottom)
        // Y轴方向平均间距，平均间距 = (最大间距Y - 所有组件高度之和) / (组件个数 - 1); 
        const averageSpacingY = parseInt(((maxBottom - minTop) - totalOffsetHeight) / (indexs.length - 1))
        // 将所有组件按照 offsetTop 值进行递增排序
        indexs.sort((a, b) => a.top - b.top)
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignIsometricY', { averageSpacingY, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 获取被选中的组件元素
    getSelectedComponentsElement () {
      return Array.prototype.slice.call(document.querySelectorAll('.selected'))
    }

  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .tool-bar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(50% - 4px);
    margin: 2px 0;
    span {
      width: 50px;
      height: 100%;
      margin: 0 5px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      cursor: pointer;
      background: #fefefe;
      :hover {
        background: #ecf5ff;
      }
    }
    .disabled {
      cursor: not-allowed;
      :hover {
        background: #fefefe;
      }
    }
  }
}
</style>