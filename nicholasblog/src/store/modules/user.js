let state = {
  active: '',
  UnReadNotify:[],
  notify: []
}
const actions = {}
const mutations = {
  setactive(state, id) {
    state.active = id
  },
  unactive(state){
    state.active = ''
  }
}
const getters = {
  getactive(state) {
    return state.active
  }
}
export default {
  actions,
  state,
  mutations,
  getters
}