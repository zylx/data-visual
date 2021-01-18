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
        <component-list ref="componentList" />
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

    <!-- 预览 -->
    <Preview v-model="isShowPreview" @handleClose="handlePreviewClose" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
import ComponentList from '@/components/ComponentList' // 左侧组件列表
import componentConfigList from '@/customComponents/configList' // 左侧组件列表数据
import Editor from '@/components/Editor' // 编辑器
import ToolBar from '@/components/ToolBar'
import AttrList from '@/components/AttrList' // 右侧属性列表
const Preview = () => import('@/components/Preview') // 异步加载，而且仅当点击【预览】时，才会加载 DOM（使用v-if判断显示，初始化减少页面资源加载和编辑器操作响应触发）
import { cloneDeep, generateID } from '@/utils/utils'

export default {
  nam: 'Home',
  components: {
    ComponentList,
    Editor,
    Preview,
    ToolBar,
    AttrList
  },
  data () {
    return {
      activeName: 'attr',
      isShowPreview: false
    }
  },
  computed: mapState([
    'componentData',
    'curComponent',
    'canvasStyle'
  ]),
  mounted () {
    eventBus.$on('showPreview', this.handleShowPreview)
  },
  methods: {
    handleDrop (e) { // 源对象拖放到目标对象中，目标对象完全接受被拖拽对象时触发，可理解为在目标对象内松手时触发
      e.preventDefault()
      e.stopPropagation()
      const component = cloneDeep(componentConfigList[e.dataTransfer.getData('index')])

      if (component.component === 'v-image') { // 弹出文件选框，插入图片
        const componentListRefs = this.$refs.componentList
        componentListRefs.$refs.filElem.dispatchEvent(new MouseEvent('click'))
        // 监听 handleFileChange 图片选择事件，使用 $once 执行一次就清除事件，不然会导致事件累加触发，出现多张图片重复上传
        eventBus.$once('handleFileChange', (e) => this.handleFileChange(e))
      } else {
        component.style.top = e.offsetY
        component.style.left = e.offsetX
        // 组件ID 等于 componentData 数组中最大的 组件ID 加上1
        component.id = generateID(this.componentData)
        this.$store.commit('addComponent', component)
        this.$store.commit('recordSnapshot') // 保存快照
      }
    },

    handleDragOver (e) { // 源对象在过程对象范围内移动，被拖拽对象在过程对象内移动时触发
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy' // 复制拖动元素
    },

    // 不选中元素
    deselectCurComponent () {
      this.$store.commit('setCurComponent', { component: null, zIndex: null })
      this.$store.dispatch('contextMenu/hideContextMenu')
    },

    handleFileChange (e) {
      console.log(e)
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        this.$message.error('只能插入图片')
        return
      }
      if (file.size > 1024 * 300) {
        this.$message.error('插入图片尺寸过大，请限制在300Kb以内！')
        return
      }

      let reader = new FileReader()
      reader.onload = (res) => {
        console.log(res.target)
        const fileResult = res.target.result
        let img = new Image()
        img.onload = () => {
          this.$store.commit('addComponent', {
            id: generateID(this.componentData),
            component: 'v-image',
            label: '图片',
            icon: '',
            propValue: fileResult,
            animations: [],
            events: [],
            style: {
              top: 0,
              left: 0,
              width: 300,
              height: 300 * (img.height / img.width),
              rotate: '',
            },
          })
        }
        img.src = fileResult
      }

      reader.readAsDataURL(file)
    },

    // 预览
    handleShowPreview () {
      this.isShowPreview = true
      this.$store.commit('setEditMode', 'read')
    },

    // 关闭预览
    handlePreviewClose () {
      this.$store.commit('setEditMode', 'edit')
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
      .el-tabs {
        .el-tabs__header {
          margin-bottom: 0 !important;
        }
        .placeholder {
          padding: 20px 10px;
          text-align: center;
          color: #82848a;
        }
      }
    }
  }
}
</style>