<template>
  <div
    class="editor"
    id="editor"
    :class="{ edit: isEdit }"
    :style="{
      width: canvasStyle.width + 'px',
      height: canvasStyle.height + 'px',
    }"
  >
    <!--页面组件展示-->
    <template v-for="item in componentData">
      <component
        v-if="item.component !== 'v-text'"
        class="component"
        :is="item.component"
        :key="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
      />
      <component
        v-else
        class="component"
        :is="item.component"
        :key="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        @input="handleInput"
        :element="item"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getStyle from '@/utils/style'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
  },
  computed: mapState([
    'componentData',
    'canvasStyle'
  ]),
  methods: {
    handleInput (element, value) {
      element.propValue = value
    },

    getComponentStyle (style) {
      return getStyle(style, ['top', 'left', 'width', 'height', 'zIndex', 'rotate'])
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