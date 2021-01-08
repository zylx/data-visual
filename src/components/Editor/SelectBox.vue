<template>
  <div class="select-box" :style="getBoxStyle()"></div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SelectBox',
  computed: mapState([
    'selectBoxStyle'
  ]),
  methods: {
    getBoxStyle () {
      const result = { ...this.selectBoxStyle }
      result.display = result.display || 'none'
      result.width = (result.width || 0) + 'px'
      result.height = (result.height || 0) + 'px'
      result.left = (result.left || 0) + 'px'
      result.top = (result.top || 0) + 'px'
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
  position: absolute;
  font-size: 0px;
  margin: 0px;
  padding: 0px;
  border: 2px dashed #3995f1;
  background-color: #b8dbef;
  z-index: 999;
  opacity: 0.5;
}
</style>