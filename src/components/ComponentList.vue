<template>
  <div @dragstart="handleDragStart" class="component-list">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      draggable
      :data-index="index"
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </div>
    <!-- 图片插入（上传） -->
    <input type="file" ref="filElem" @change="handleChange" hidden />
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import componentList from '@/customComponents/configList'

export default {
  data () {
    return {
      componentList,
    }
  },
  methods: {
    handleDragStart (e) { // 源对象开始拖放，开始移动时事件触发
      e.stopPropagation()
      e.dataTransfer.setData('index', e.target.dataset.index)
    },
    handleChange (e) {
      e.stopPropagation()
      // 触发 handleFileChange 事件
      console.log('handleFileChange')
      eventBus.$emit('handleFileChange', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;

  .list {
    width: 45%;
    border: 1px solid #ddd;
    cursor: grab;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 2px 5px;
  }
}
</style>