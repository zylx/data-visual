<template>
  <div class="home">
    <header>
      <section class="tool-bar-area">
        <tool-bar />
      </section>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyle.width" />
        <span>*</span>
        <input v-model="canvasStyle.height" />
      </div>
    </header>
    <main>
      <!-- 左侧组件列表 -->
      <section class="left-side">
        <component-list />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @click="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right-side">
        <el-tabs v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <AttrList v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComponentList from '@/components/ComponentList' // 左侧组件列表
import componentConfigList from '@/customComponents/configList' // 左侧组件列表数据
import Editor from '@/components/Editor' // 编辑器
import ToolBar from '@/components/ToolBar'
import AttrList from '@/components/AttrList' // 右侧属性列表
import { cloneDeep } from '@/utils/utils'

export default {
  nam: 'Home',
  components: {
    ComponentList,
    Editor,
    ToolBar,
    AttrList
  },
  data () {
    return {
      activeName: 'attr',
    }
  },
  computed: mapState([
    'componentData',
    'curComponent',
    'canvasStyle'
  ]),
  methods: {
    handleDrop (e) { // 源对象拖放到目标对象中，目标对象完全接受被拖拽对象时触发，可理解为在目标对象内松手时触发
      e.preventDefault()
      e.stopPropagation()
      const component = cloneDeep(componentConfigList[e.dataTransfer.getData('index')])
      component.style.top = e.offsetY
      component.style.left = e.offsetX
      console.log(this.componentData)
      // 组件ID 等于 componentData 数组中最大的 组件ID 加上1
      component.id = this.componentData.length && (this.componentData.reduce((prve, cur) => cur.id > prve ? cur.id : prve, 1) + 1) || 1
      console.log(component.id)
      this.$store.commit('addComponent', component)
      this.$store.commit('recordSnapshot') // 保存快照
    },

    handleDragOver (e) { // 源对象在过程对象范围内移动，被拖拽对象在过程对象内移动时触发
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy' // 复制拖动元素
    },

    // 不选中元素
    deselectCurComponent () {
      this.$store.commit('setCurComponent', { component: null, zIndex: null })
      this.$store.commit('hideContexeMenu')
    }

  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  header {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #ececec;
    .tool-bar-area {
      height: 100%;
      text-align: center;
    }
  }

  main {
    display: flex;
    height: 100%;
    flex: 1;
    background: #efefef;
    .left-side {
      width: 200px;
      height: 100%;
      padding: 15px 10px;
      background: #fff;
    }
    .center {
      flex: 1;
      margin: 5px 10px;
      overflow: hidden;
      background: #ccc;
      .content {
        height: 100%;
        overflow: auto;
        // display: flex;
        // align-items: center;
        // justify-content: center;
      }
    }
    .right-side {
      width: 220px;
      height: 100%;
      overflow: auto;
      background: #fff;
      .placeholder {
        text-align: center;
        color: #333;
      }
    }
  }
}
</style>