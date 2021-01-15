<template>
  <div class="bg" v-show="show">
    <el-button icon="el-icon-close" class="close" circle @click="close" />
    <div
      class="canvas"
      :style="{
        width: canvasStyle.width + 'px',
        height: canvasStyle.height + 'px',
      }"
    >
      <ComponentWrapper v-if="show" :componentData="componentData" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComponentWrapper from './ComponentWrapper'
import getStyle from '@/utils/style'

export default {
  model: {
    prop: 'show',
    event: 'handleClose'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: { ComponentWrapper },
  computed: mapState([
    'componentData',
    'canvasStyle'
  ]),
  methods: {
    getStyle,

    close () {
      this.$emit('handleClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas {
    background: #fff;
    position: relative;
  }

  .close {
    position: absolute;
    right: 30px;
    top: 30px;
  }
}
</style>