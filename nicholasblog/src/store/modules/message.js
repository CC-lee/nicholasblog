let state = {
  position: 0,
  status: 'board',
  messageSearch: ''
}

const mutations = {
  saveposition(state, position) {
    state.position = position;
  },
  changestatus(state, change) {
    state.status = change
  },
  enableSearch(state, signal) {
    state.messageSearch = signal;
  }
}

const getters = {
  getposition(state) {
    return state.position
  },
  getstatus(state) {
    return state.status
  },
  getSearch(state) {
    return state.messageSearch
  }
}

export default {
  state,
  mutations,
  getters
}