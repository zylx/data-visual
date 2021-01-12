<template>
  <div class="tool-bar">
    <div class="tool-bar-item">
      <span :class="{ disabled: !canUndo }" @click="undo">
        <icon name="undo" />
      </span>
      <span :class="{ disabled: !canRedo }" @click="redo">
        <icon name="redo" />
      </span>
      <span @click="preview">
        <icon name="yulan" />
      </span>
      <span :class="{ disabled: !canClearCanvas }" @click="clearCanvas">
        <icon name="qingchu" />
      </span>
    </div>
    <div class="tool-bar-item">
      <span @click="alignTop">
        <icon name="shangduiqi" />
      </span>
      <span @click="alignBottom">
        <icon name="xiaduiqi" />
      </span>
      <span @click="alignLeft">
        <icon name="zuoduiqi" />
      </span>
      <span @click="alignRight">
        <icon name="youduiqi" />
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import eventBus from '@/utils/eventBus'
import Icon from '@/components/Icon'
import { setLocalStorage } from '@/utils/utils'

export default {
  nam: 'Home',
  components: { Icon },
  computed: {
    ...mapGetters([
      'componentData',
      'canUndo',
      'canRedo',
      'canClearCanvas'
    ])
  },
  methods: {
    // 撤消
    undo () {
      this.canUndo && this.$store.dispatch('toolBar/undo')
    },

    // 重做
    redo () {
      this.canRedo && this.$store.dispatch('toolBar/redo')
    },

    // 预览
    preview () {
      eventBus.$emit('showPreview')
    },

    // 清屏
    clearCanvas () {
      this.canClearCanvas && this.$messageBox.confirm('画布内容尚未保存，确定要清空吗？', '提示', {
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
    },

    /** 对齐方式 **/
    // 上对齐，被选中组件中，找出距离编辑器上边框最近的组件，其它组件上边框与它的上边框对齐
    alignTop () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetTop 并转化为数组，再求数组最小值
        const minTop = Math.min.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetTop)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignTop', { minTop, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 下对齐，被选中组件中，找出距离编辑器下边框最近的组件，其它组件下边框与它的下边框对齐
    alignBottom () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetTop + offsetHeight 并转化为数组，再求数组最大值
        const maxBottom = Math.max.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetTop + cur.offsetHeight)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignBottom', { maxBottom, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 左对齐，被选中组件中，找出距离编辑器左边框最近的组件，其它组件左边框与它的左边框对齐
    alignLeft () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetLeft 并转化为数组，再求数组最小值
        const minLeft = Math.min.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetLeft)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignLeft', { minLeft, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 右对齐，被选中组件中，找出距离编辑器右边框最近的组件，其它组件右边框与它的右边框对齐
    alignRight () {
      const components = this.getSelectedComponentsElement()
      if (components.length) {
        const indexs = []
        // 先获取组件的 offsetLeft + offsetWidth 并转化为数组，再求数组最大值
        const maxRight = Math.max.apply(null, components.reduce((prev, cur) => {
          // cIndex，对应 componentData 数组中的索引下标
          indexs.push(parseInt(cur.getAttribute('index')))
          prev.push(cur.offsetLeft + cur.offsetWidth)
          return prev
        }, []))
        // 可通过 indexs 遍历更新 componentData 数组中对应的元素
        this.$store.dispatch('toolBar/alignRight', { maxRight, indexs })
        this.$store.commit('recordSnapshot')
      }
    },

    // 获取被选中的组件元素
    getSelectedComponentsElement () {
      return Array.prototype.slice.call(document.querySelectorAll('.selected'))
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