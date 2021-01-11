const getters = {
  canUndo: state => state.snapshotIndex > 0 ? true : false, // 撤消按钮是否可用
  canRedo: state => state.snapshotIndex < state.snapshotData.length - 1 ? true : false, // 重做按钮是否可用
  canClearCanvas: state => state.componentData.length > 0 ? true : false // 清屏按钮是否可用
}

export default getters