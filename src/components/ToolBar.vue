<template>
  <div class="tool-bar">
    <div class="tool-bar-item">
      <span :class="{ disabled: !undoEnable }" @click="undo">
        <icon name="undo" :styles="{ padding: '2px 5px', color: '#66b1ff' }" />
      </span>
      <span :class="{ disabled: !redoEnable }" @click="redo">
        <icon name="redo" :styles="{ padding: '2px 5px', color: '#66b1ff' }" />
      </span>
    </div>
    <div class="tool-bar-item">
      <span><icon name="undo" /></span>
      <span><icon name="redo" /></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '@/components/Icon'

export default {
  nam: 'Home',
  components: { Icon },
  computed: {
    ...mapGetters([
      "undoEnable",
      "redoEnable"
    ])
  },
  methods: {
    // 撤消
    undo () {
      this.undoEnable && this.$store.commit('undo')
    },

    // 重做
    redo () {
      this.redoEnable && this.$store.commit('redo')
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
      color: #606266;
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