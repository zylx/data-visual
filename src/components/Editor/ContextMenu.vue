<template>
  <div
    class="contextmenu"
    v-show="menuShow"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
  >
    <ul>
      <li @click="del">删除</li>
      <li @click="toTop">置顶</li>
      <li @click="toBottom">置底</li>
      <li @click="moveUp">上移</li>
      <li @click="moveDown">下移</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: mapState('contextMenu', [
    'menuTop',
    'menuLeft',
    'menuShow',
  ]),
  methods: {
    ...mapActions('contextMenu', [
      'deleteComponent',
      'upComponent',
      'downComponent',
      'topComponent',
      'bottomComponent'
    ]),

    ...mapMutations([
      'recordSnapshot'
    ]),

    del () {
      this.deleteComponent()
      this.recordSnapshot()
    },

    moveUp () {
      this.upComponent()
      this.recordSnapshot()
    },

    moveDown () {
      this.downComponent()
      this.recordSnapshot()
    },

    toTop () {
      this.topComponent()
      this.recordSnapshot()
    },

    toBottom () {
      this.bottomComponent()
      this.recordSnapshot()
    }
  }
}
</script>

<style lang="scss" scoped>
.contextmenu {
  position: absolute;
  z-index: 1000;

  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    padding: 6px 0;

    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>