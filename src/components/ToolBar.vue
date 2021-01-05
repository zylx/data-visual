<template>
  <div class="tool-bar">
    <div class="tool-bar-item">
      <span :class="{ disabled: !undoEnable }">
        <icon
          name="undo"
          @click.native="undo"
          :styles="{ padding: '2px 5px', color: '#66b1ff' }"
        />
      </span>
      <span :class="{ disabled: !redoEnable }">
        <icon
          name="redo"
          @click.native="redo"
          :styles="{ padding: '2px 5px', color: '#66b1ff' }"
        />
      </span>
    </div>
    <div class="tool-bar-item">
      <span><icon name="undo" /></span>
      <span><icon name="redo" /></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Icon from '@/components/Icon'

export default {
  nam: 'Home',
  components: { Icon },
  computed: mapState([
    "undoEnable",
    "redoEnable"
  ]),
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
      border: 1px solid #e3e3e3;
      border-radius: 3px;
      cursor: pointer;
      background: #f6f6f6;
      :hover {
        background: #fff;
      }
    }
    .disabled {
      cursor: not-allowed;
      :hover {
        background: #f6f6f6;
      }
    }
  }
}
</style>