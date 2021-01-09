<template>
  <div class="tool-bar">
    <div class="tool-bar-item">
      <span :class="{ disabled: !canUndo }" @click="undo">
        <icon name="undo" :styles="{ padding: '2px 5px', color: '#66b1ff' }" />
      </span>
      <span :class="{ disabled: !canRedo }" @click="redo">
        <icon name="redo" :styles="{ padding: '2px 5px', color: '#66b1ff' }" />
      </span>
      <span :class="{ disabled: !canClearCanvas }" @click="clearCanvas">
        <icon
          name="qingchu"
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
import { mapGetters } from 'vuex'
import Icon from '@/components/Icon'
import { setLocalStorage } from '@/utils/utils'

export default {
  nam: 'Home',
  components: { Icon },
  computed: {
    ...mapGetters([
      'canUndo',
      'canRedo',
      'canClearCanvas'
    ])
  },
  methods: {
    // 撤消
    undo () {
      this.canUndo && this.$store.commit('undo')
    },

    // 重做
    redo () {
      this.canRedo && this.$store.commit('redo')
    },

    // 清屏
    clearCanvas () {
      this.$messageBox.confirm('画布内容尚未保存，确定要清空吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setComponentData', [])
        // 清空组件缓存
        setLocalStorage('componentData', [])
        // 清空快照缓存
        setLocalStorage('snapshotIndex', - 1)
        setLocalStorage('snapshotData', [])
      }).catch(() => { })
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