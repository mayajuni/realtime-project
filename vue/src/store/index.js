import Vue from 'vue'
import Vuex from 'vuex'
import exPluin from './plugin/ex-plugin'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {},
  state: {},
  mutations: {},
  plugins: [exPluin]
})

export default store
