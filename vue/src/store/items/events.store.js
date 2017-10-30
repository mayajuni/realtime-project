const events = {
  state: {
    /* router, action, payload로 이루어 져야됨. */
    events: []
  },
  actions: {
    addEvent (context, event) {
      if (!(event.router && event.action && event.payload)) {
        throw new Error('wrong event parameters')
      }
      context.commit('addEvent', event)
    },
    removeEvent (context, event) {
      context.commit('removeEvent', event)
    }
  },
  mutations: {
    addEvent (state, event) {
      state.events.push(event)
    },
    removeEvent (state, removeEvent) {
      state.events = state.events.filter(event => event !== removeEvent)
    }
  }
}

export default events
