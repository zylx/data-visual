import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import getters from './getters'
import toolBar from './modules/toolBar'
import contextMenu from './modules/contextMenu'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  modules: {
    toolBar,
    contextMenu
  }
})

export default store