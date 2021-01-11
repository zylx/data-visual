<template>
  <div
    :index="cIndex"
    :class="['shape', { active, selected }]"
    @click="selectCurComponent"
    @mousedown="handleMouseDown"
    @contextmenu="handleContextMenu"
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
import eventBus from '@/utils/eventBus'
import { cloneDeep } from '@/utils/utils'

export default {
  props: {
    active: { // 当前被操作的组件激活状态
      type: Boolean,
      default: false
    },
    selected: { // 组件是否被选中
      type: Boolean,
      default: false
    },
    element: { // 对应 componentData 数组中的项
      require: true,
      type: Object
    },
    cIndex: { // 对应 componentData 数组中的索引下标
      require: true,
      type: [Number, String]
    }
  },
  data () {
    return {
      pointList: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      directionKey: { t: 'n', b: 's', l: 'w', r: 'e' } // 光标显示样式
    }
  },
  computed: mapState([
    'curComponent',
    'componentData',
    'selectedComponents'
  ]),
  methods: {
    getPointStyle (point) {
      const { width, height } = this.element.style
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

      // 深拷贝组件数据，用于下面操作的状态变更，等到鼠标抬起时再统一更新 store 中的状态
      let componentData = cloneDeep(this.componentData)
      // 获取被选中的组件
      const components = document.querySelectorAll('.selected')
      // 获取组件初始状态相对于编辑器原点的 left、top 偏移量
      const offsetStyle = this.getOffsetStyle(components)

      // 检查是否按住 ctrl 键行为来设置组件状态
      this.checkCtrlAction(componentData, components, e.ctrlKey)

      const startX = e.clientX // 点击时鼠标的 X 坐标
      const startY = e.clientY // 点击时鼠标的 Y 坐标

      // 鼠标拖拽当前组件
      let hasMove = false // 如果元素没有移动，则不保存快照
      const move = (moveEvent) => {
        hasMove = true
        const currX = moveEvent.clientX // 移动时，鼠标当前的 X 坐标
        const currY = moveEvent.clientY // 移动时，鼠标当前的 Y 坐标

        // 遍历并移动被选中的单个或多个组件
        components.forEach((component) => {
          // cIndex，对应 componentData 数组中的下标
          const cIndex = parseInt(component.getAttribute('index'))
          // offsetStyle[cId].offsetLeft 拖动前，组件相对于编辑器原点的初始 X 轴坐标
          const left = (currX - startX) + offsetStyle[cIndex].offsetLeft || 0
          const top = (currY - startY) + offsetStyle[cIndex].offsetTop || 0
          component.style.left = `${left}px`
          component.style.top = `${top}px`
          // 更新对应的组件位置信息
          componentData[cIndex].style.left = left
          componentData[cIndex].style.top = top
        })

        // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
        // 如果不使用 $nextTick，吸附后将无法移动
        this.$nextTick(() => {
          // 触发元素移动事件，用于显示标线、吸附功能
          // 后面两个参数代表鼠标移动方向
          // currY - startY > 0 true 表示向下移动 false 表示向上移动
          // currX - startX > 0 true 表示向右移动 false 表示向左移动
          eventBus.$emit('move', this.$el, currY - startY > 0, currX - startX > 0)
        })
      }

      const up = () => {
        // 更新组件列表
        components.length && this.$store.commit('setComponentData', componentData)
        hasMove && this.$store.commit('recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.$emit('unmove')
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

      const pos = this.element.style
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
      }

      const up = () => {
        needSave && this.$store.commit('recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    // 右键菜单
    handleContextMenu (e) {
      e.stopPropagation()
      e.preventDefault()

      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.offsetY
      let left = e.offsetX
      while (!target.className.includes('editor')) {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      }

      this.$store.dispatch('contextMenu/showContextMenu', { top, left })
    },

    // 获取组件初始状态相对于编辑器原点的 left、top 偏移量
    getOffsetStyle (components) {
      const offsetStyle = {}
      components.length && components.forEach((component) => {
        // cIndex，对应 componentData 数组中的索引下标
        const cIndex = component.getAttribute('index')
        offsetStyle[cIndex] = {
          offsetLeft: component.offsetLeft,
          offsetTop: component.offsetTop
        }
      })
      return offsetStyle
    },

    // 检查是否按住 ctrl 键行为来设置组件状态
    checkCtrlAction (componentData, components, ctrlKey) {
      // 为了避免在子组件中修改父组件传进来的 props 时报错，需要重新定义一个变量，值为 this.cIndex
      let curCindex = this.cIndex
      // 设置当前组件为选中状态
      componentData[curCindex].selected = true

      // 检查是否按住 ctrl 键不放，如是则开启点选组件功能
      if (!ctrlKey && !this.element.selected) {
        // 不是按住 ctrl 键且点击前组件是未被选中状态，则取消其它组件的选中状态
        components.forEach((component) => {
          const cIndex = parseInt(component.getAttribute('index'))
          if (cIndex !== curCindex) {
            componentData[cIndex].selected = false
          }
        })
      } else if (ctrlKey && this.element.selected) {
        // 按住 ctrl 键且点击前组件是被选中状态，则取消当前组件的选中状态
        componentData[this.cIndex].selected = false
        // 取消当前组件的 active 状态
        curCindex = null
      }

      // 更新当前组件状态
      this.$store.commit('setCurComponent', { component: this.element, zIndex: curCindex })
      // 更新组件列表
      this.$store.commit('setComponentData', componentData)
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
.selected {
  border: 1px solid #66b1ff;
  background-color: rgba(112, 192, 255, 0.3);
  cursor: move;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  border-radius: 50%;
}
</style>