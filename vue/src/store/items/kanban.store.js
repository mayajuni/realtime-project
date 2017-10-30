const kanban = {
  state: {
    lists: []
  },
  actions: {
    initLists (context, lists) {
      context.commit('initLists', lists)
    },
    addList (context, list) {
      context.commit('addList', list)
    },
    updateList (context, list) {
      context.commit('updateList', list)
    },
    removeList (context, listId) {
      context.commit('removeList', listId)
    }
  },
  getters: {
    lists: state => state.lists.sort((a, b) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0)
  },
  mutations: {
    initLists (state, lists) {
      state.lists = lists
    },
    addList (state, list) {
      state.lists.push(list)
    },
    removeList (state, listId) {
      state.lists = state.lists.filter(list => list.id !== listId)
    },
    updateList (state, updatedList) {
      state.lists = state.lists.map(list => {
        if (list.id === updatedList.id) {
          list = updatedList
        }

        return list
      })
    }
  }
}

export default kanban
