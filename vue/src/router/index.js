import Vue from 'vue'
import Router from 'vue-router'
import Kanban from '../components/realtime-project/view/kaban-board/kanban.view.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Kanban',
      component: Kanban
    }
  ]
})
