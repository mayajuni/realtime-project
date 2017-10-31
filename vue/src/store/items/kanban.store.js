const kanban = {
  state: {
    kanban: {}
  },
  actions: {
    initKanban (context, kanban) {
      context.commit('initKanban', kanban)
    },
    updateKanban (context, kanban) {
      context.commit('updateKanban', kanban)
    }
  },
  getters: {
    kanban: state => state.kanban,
    lists: state => state.kanban.lists ? state.kanban.lists.sort((a, b) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0) : [],
    kanbanId: state => state.kanban.id
  },
  mutations: {
    initKanban (state, kanban) {
      state.kanban = kanban
    },
    // 위의 init과 똑같은 역활을 하지만 추후 다른 부분이 생길 가능성이 있어서 따로 분리.
    updateKanban (state, kanban) {
      state.kanban = kanban
    }
  }
}

export default kanban
