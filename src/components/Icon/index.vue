<template>
  <div class="icon-wrapper" :style="{ ...styles }">
    <svg class="icon" aria-hidden="true">
      <use :href="iconName" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    name: String,
    prefix: {
      type: String,
      default: 'icon'
    },
    styles: Object
  },
  computed: {
    iconName () {
      return `#${this.prefix}-${this.name}`
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4px 8px;
  .icon {
    width: 100%; // 继承父容器宽高
    height: 100%;
    vertical-align: -0.15em;
    fill: currentColor; // 继承父类颜色
    overflow: hidden;
  }
}
</style>