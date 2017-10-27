import Vue from 'vue'
import Vuex from 'vuex'
import socketPlugin from './plugin/socket.plugin'
import kanban from './items/kanban.store'
import events from './items/events.store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {kanban, events},
  state: {},
  mutations: {},
  plugins: [socketPlugin]
})

export default store
