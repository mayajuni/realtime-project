import Vue from 'vue'
import Vuex from 'vuex'
import socketPlugin from './plugin/socket.plugin'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {},
  state: {},
  mutations: {},
  plugins: [socketPlugin]
})

export default store
