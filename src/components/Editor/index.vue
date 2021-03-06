<template>
  <div
    id="editor"
    class="editor"
    :class="{ edit: isEdit }"
    :style="{
      width: canvasStyle.width + 'px',
      height: canvasStyle.height + 'px',
    }"
    @mousedown="handleMouseDown"
  >
    <!--页面组件展示-->
    <shape
      v-for="(item, index) in componentData"
      :style="getShapeStyle(item.style, index)"
      :key="item.id"
      :active="index === curComponentZIndex"
      :selected="item.selected || false"
      :element="item"
      :cIndex="index"
    >
      <component
        v-if="item.component !== 'v-text'"
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :id="item.id"
        :propValue="item.propValue"
      />
      <component
        v-else
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        @input="handleInput"
        :element="item"
      />
    </shape>
    <!-- 右击菜单 -->
    <context-menu />
    <!-- 标线 -->
    <mark-line />
    <!-- 选框 -->
    <select-box />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Shape from './Shape'
import ContextMenu from './ContextMenu'
import MarkLine from './MarkLine'
import SelectBox from './SelectBox'
import getStyle from '@/utils/style'
import { cloneDeep } from '@/utils/utils'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  components: { Shape, ContextMenu, MarkLine, SelectBox },
  mounted () {
    const editorNode = document.querySelector('#editor')
    this.$store.commit('setEditorNode', editorNode)
  },
  computed: mapState([
    'editorNode',
    'curComponentZIndex',
    'componentData',
    'canvasStyle'
  ]),
  methods: {
    getShapeStyle (style, index) {
      const result = { ...style }
      result.width = (result.width || 0) + 'px'
      result.height = (result.height || 0) + 'px'
      result.left = (result.left || 0) + 'px'
      result.top = (result.top || 0) + 'px'
      if (result.rotate) {
        result.transform = 'rotate(' + result.rotate + 'deg)'
      }
      // 按顺序添加 z-index 层级
      result.zIndex = index

      return result
    },

    getComponentStyle (style) {
      return getStyle(style, ['top', 'left', 'width', 'height', 'zIndex', 'rotate'])
    },

    handleInput (element, value) {
      // 根据文本组件高度调整 shape 高度
      let { lineHeight, fontSize, height } = element.style
      lineHeight = lineHeight || 1.5
      const newHeight = value.split('\n').length * lineHeight * fontSize
      element.style.height = height > newHeight ? height : newHeight
      // 将上一次输入框取消选中并设置值
      element.selected = false
      element.propValue = value
      // 保存快照
      this.$store.commit('recordSnapshot')
    },

    handleMouseDown (e) {
      e.stopPropagation()

      // 获取编辑器相对于视窗的位置集合，主要包含 left、top、right、bottom、width、height、x、y属性。
      const editorRectInfo = this.editorNode.getBoundingClientRect()
      // 点击时鼠标位置相对于编辑器原点的 X 坐标
      const startX = e.clientX - editorRectInfo.left
      // 点击时鼠标位置相对于编辑器原点的 Y 坐标
      const startY = e.clientY - editorRectInfo.top

      // 获取画布上的所有组件，深拷贝是为了不影响原来的数据和频繁的触发响应更新
      // 每次点击拷贝一次即可，不要在 move 事件或者其中调用的 this.getSelectedComponents 方法中频繁拷贝
      let componentData = cloneDeep(this.componentData)
      componentData.forEach((item, index) => {
        item.selected = false
        componentData[index] = item
      });
      // 更新组件列表，恢复组件取消选中状态
      this.$store.commit('setComponentData', componentData)

      // 已选中组件列表
      let selectedComponents = []
      const move = (moveEvent) => {
        // 移动时，当前鼠标位置相对于编辑器原点的 X 坐标
        const currX = moveEvent.clientX - editorRectInfo.left
        // 移动时，当前鼠标位置相对于编辑器原点的 Y 坐标
        const currY = moveEvent.clientY - editorRectInfo.top
        // 拖拽选框样式
        const selectBoxStyle = {
          display: 'block',
          left: Math.min(currX, startX),
          top: Math.min(currY, startY),
          width: Math.abs(currX - startX),
          height: Math.abs(currY - startY)
        }
        // 更新 selectBox 位置及宽高
        this.$store.commit('setSelectBoxStyle', selectBoxStyle)
        // 根据鼠标拖拽选框获取被选中组件列表
        selectedComponents = this.getSelectedComponents(selectBoxStyle, componentData)
      }

      const up = () => {
        // 恢复拖拽选框样式
        this.$store.commit('setSelectBoxStyle', {})
        // 更新被选中组件列表
        this.$store.commit('setSelectedComponents', selectedComponents)
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },

    // 关键算法，根据鼠标拖拽选框获取被选中组件列表
    getSelectedComponents (selectBoxStyle, componentData) {
      const selectedComponents = []
      // 移动时，选框左上角相对于编辑器原点的 X 坐标
      let sl = selectBoxStyle.left,
        // 移动时，选框左上角相对于编辑器原点的 Y 坐标
        st = selectBoxStyle.top
      // 移动时，选框的宽度
      let sw = selectBoxStyle.width,
        // 移动时，选框的高度
        sh = selectBoxStyle.height

      for (let i = 0; i < componentData.length; i++) {
        let cStyle = componentData[i].style
        // 组件右下角相对于编辑器原点的 X 坐标
        let cl = cStyle.left + cStyle.width
        // 组件右下角相对于编辑器原点的 Y 坐标
        let ct = cStyle.top + cStyle.height
        // 组件被选中需要共同满足以下两个条件，才能保证选框与组件有接触：
        // 1、选框左上角坐标（X,Y）值必须都小于组件的右下角坐标（X,Y）值
        // 2、选框右下角坐标（X,Y）值必须都大于组件的左上角坐标（X,Y）值
        if ((sl < cl && st < ct) && (sl + sw > cStyle.left && st + sh > cStyle.top)) {
          if (selectedComponents.indexOf(componentData[i]) === -1) {
            selectedComponents.push(componentData[i])
            componentData[i].selected = true
          }
        } else {
          componentData[i].selected = false
        }
      }

      return selectedComponents
    }

  }
}
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>