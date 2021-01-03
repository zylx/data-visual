<template>
  <div
    class="shape"
    :class="{ active: this.active }"
    @click="selectCurComponent"
    @mousedown="handleMouseDown"
  >
    <div
      class="shape-point"
      v-for="(item, index) in active ? pointList : []"
      @mousedown="handleMouseDownOnPoint(item)"
      :key="index"
      :style="getPointStyle(item)"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    element: {
      require: true,
      type: Object,
    },
    defaultStyle: {
      require: true,
      type: Object,
    },
    zIndex: {
      require: true,
      type: [Number, String],
    },
  },
  data () {
    return {
      pointList: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      directionKey: { t: 'n', b: 's', l: 'w', r: 'e' } // 光标显示样式
    }
  },
  computed: mapState([
    'curComponent',
  ]),
  methods: {
    getPointStyle (point) {
      const { width, height } = this.defaultStyle
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0
      // 为保证小圆点相对于边框线居中，右、下方圆点偏移量 = 宽（高） - 边框宽度 * 2
      const offsetLeft = width - 2
      const offsetLTop = height - 2

      // 位于四个角的点
      if (point.length === 2) {
        newLeft = hasL ? 0 : offsetLeft
        newTop = hasT ? 0 : offsetLTop
      } else {
        // 位于上下边框的中点，宽度居中
        if (hasT || hasB) {
          newLeft = Math.floor(offsetLeft / 2)
          newTop = hasT ? 0 : offsetLTop
        }
        // 位于左右边框的中点，高度居中
        if (hasL || hasR) {
          newLeft = hasL ? 0 : offsetLeft
          newTop = Math.floor(offsetLTop / 2)
        }
      }
      const pointDiameter = 6 // 控制点直径
      const style = {
        width: `${pointDiameter}px`,
        height: `${pointDiameter}px`,
        marginLeft: `-${pointDiameter / 2}px`,
        marginTop: `-${pointDiameter / 2}px`,
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: point.split('').reverse().map(m => this.directionKey[m]).join('') + '-resize'
      }

      return style
    },

    // 鼠标按下选中当前组件
    handleMouseDown (e) {
      if (this.element.component !== 'v-text') {
        e.preventDefault()
      }
      e.stopPropagation()
      this.$store.commit('setCurComponent', { component: this.element, zIndex: this.zIndex })

      const pos = { ...this.defaultStyle }
      const startX = e.clientX // 点击时鼠标的 X 坐标
      const startY = e.clientY // 点击时鼠标的 Y 坐标
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startLeft = Number(pos.left) // 当前被拖拽组件的 X 轴坐标
      const startTop = Number(pos.top) // 当前被拖拽组件的 Y 轴坐标

      // 鼠标拖拽当前组件
      let hasMove = false // 如果元素没有移动，则不保存快照
      const move = (moveEvent) => {
        hasMove = true
        const currX = moveEvent.clientX // 移动时，鼠标当前的 X 坐标
        const currY = moveEvent.clientY // 移动时，鼠标当前的 Y 坐标
        pos.left = (currX - startX) + startLeft // 鼠标在 X 轴方向移动的相对距离加上组件初始的 X 轴坐标值，即可得到当前组件被拖拽到的 X 轴坐标
        pos.top = (currY - startY) + startTop // Y 轴方向同理
        // 修改当前组件样式
        this.$store.commit('setShapeStyle', pos)
      }

      const up = () => {
        hasMove && this.$store.commit('recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    selectCurComponent (e) {
      // 阻止向父组件冒泡
      e.stopPropagation()
      e.preventDefault()
    },

    // 鼠标按下选中当前组件边框圆点（控制点）
    handleMouseDownOnPoint (point) {
      const downEvent = window.event
      downEvent.stopPropagation()
      downEvent.preventDefault()

      const pos = { ...this.defaultStyle }
      const height = Number(pos.height)
      const width = Number(pos.width)
      const top = Number(pos.top)
      const left = Number(pos.left)
      const startX = downEvent.clientX
      const startY = downEvent.clientY

      // 控制点拖拽

      let needSave = false // 是否需要保存快照
      const move = (moveEvent) => {
        needSave = true
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        const disX = currX - startX // 鼠标在 X 轴方向移动的相对距离
        const disY = currY - startY
        const hasT = /t/.test(point)
        const hasB = /b/.test(point)
        const hasL = /l/.test(point)
        const hasR = /r/.test(point)
        // 控制点位于组件 左边框 时，组件宽度变化等于初始宽度 减去 相对移动的距离
        // 控制点位于组件 右边框 时，组件宽度变化等于初始宽度 加上 相对移动的距离
        // 在左、右边框控制点上拖拽，组件高度保持不变，上、下边框上拖拽同理
        const newWidth = width + (hasL ? -disX : (hasR ? disX : 0))
        const newHeight = height + (hasT ? -disY : (hasB ? disY : 0))
        pos.width = newWidth > 0 ? newWidth : 0
        pos.height = newHeight > 0 ? newHeight : 0
        pos.left = left + (hasL ? disX : 0)
        pos.top = top + (hasT ? disY : 0)
        this.$store.commit('setShapeStyle', pos)
      }

      const up = () => {
        needSave && this.$store.commit('recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

  }
}
</script>

<style lang="scss" scoped>
.shape {
  position: absolute;
}
.active {
  border: 1px solid #70c0ff;
  cursor: move;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  border-radius: 50%;
}
</style>