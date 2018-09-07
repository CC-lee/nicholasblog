import jwtDecode from 'jwt-decode'
import api from "api";
import execlib from '../lib/execlib'

let state = {
  token: '',
  profile: {},
  loggedIn: false,
  message: false,
  notifyNum: 0,
  hash: '1'
}
const actions = {
  async getProfile({ commit }) {
    await api.user.getUserAccount({ email: state.profile.email })
      .then((result) => {
        let { data: { code, data } } = result
        commit('changeProfile', data)
      })
      .catch(err => {
        alert(err.message);
      });
  },
  checkLogin() {

  },
  async getNum({ commit }) {
    if (state.token) {
      await api.user.getNotifyNum({ _id: state.profile._id }).then((result) => {
        let { data: { code, data } } = result
        commit('setNum', data)
      }).catch(err => {
        alert(err.message);
      });
    }
  },
  async isLogin({ commit }) {
    if (state.loggedIn == false) {
      const token = localStorage.getItem(execlib.tokenName);
      if (token) {
        const { email } = jwtDecode(token)
        await api.user.getUserAccount({ email })
          .then((result) => {
            let { data: { code, data, message } } = result
            if (code === 200) {
              commit('save', { profile: data, token: token })
            } else if (code === 401) {
              alert(message)
              localStorage.removeItem(execlib.tokenName);
              location.replace(execlib.hostFrontMainPath);
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    }
  },
  logout(state) {
    localStorage.removeItem(execlib.tokenName);
    state.loggedIn = false
    location.replace(execlib.hostFrontMainPath);
  },
  touchListen() {

  }
}
const mutations = {
  save(state, { profile, token }) {
    state.profile = profile
    state.token = token
    state.loggedIn = true
  },
  checkMessage(state) {
    state.message = true;
  },
  unMessage() {
    state.message = false;
  },
  changeProfile(state, profile) {
    if (profile.user_name) {
      state.profile = profile
    } else {
      Object.assign(state.profile, JSON.parse(JSON.stringify(profile)))
    }
  },
  changeToken(state, token) {
    state.token = token
  },
  setNum(state, data) {
    state.notifyNum = data
  },
  clearNum(state) {
    state.notifyNum = 0
  }
}
const getters = {
  getProfile(state) {
    return state.profile
  },
  getToken(state) {
    return state.token
  },
  getLog(state) {
    return state.loggedIn
  },
  getMessage(state) {
    return state.message
  },
  getNum(state) {
    return state.notifyNum
  },
  gethash(state) {
    return state.hash
  }
}

export default {
  actions,
  state,
  mutations,
  getters
}