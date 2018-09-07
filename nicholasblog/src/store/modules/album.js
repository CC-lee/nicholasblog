let state = {
  position: 0,
  status: 'album'
}

const mutations = {
  saveposition(state, position) {
    state.position = position;
  },
  changestatus(state, change) {
    state.status = change
  }
}

const getters = {
  getposition(state) {
    return state.position
  },
  getstatus(state) {
    return state.status
  }
}

export default {
  state,
  mutations,
  getters
}