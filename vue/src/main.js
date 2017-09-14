// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import eventEmiter from './modules/event-emiter/event-emiter.module'
import socketClient from './modules/socket/socket-client.module'

Vue.config.productionTip = false

socketClient.connect()

/**
 * socket이 connection이 된 후에 vue를 구동시킨다.
 */
eventEmiter.once('@connected', () =>
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
)
