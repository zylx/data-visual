import { getLocalStorage } from '@/utils/utils'

// 编辑器中的组件数据缓存
const componentDataCache = getLocalStorage('componentData') || []
// 编辑器快照数据缓存
const snapshotDataCache = getLocalStorage('snapshotData') || []
// 编辑器快照数据索引缓存
const snapshotIndexCache = getLocalStorage('snapshotIndex') || -1

const state = {
  editMode: 'edit', // 编辑器模式 edit read
  editorNode: null, // 编辑器节点
  canvasStyle: { // 页面全局数据
    width: 1280,
    height: 800,
  },
  selectBoxStyle: {},// 拖拽选框样式
  componentData: componentDataCache, // 编辑器中的组件数据
  selectedComponents: [], // 鼠标拖拽选框时，被选中的组件
  curComponent: null,
  curComponentZIndex: null,
  snapshotData: snapshotDataCache, // 保存编辑器快照数据
  snapshotIndex: snapshotIndexCache // 快照索引
}

export default state