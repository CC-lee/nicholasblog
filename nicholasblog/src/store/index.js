import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'
import user from './modules/user'
import message from './modules/message'
import article from './modules/article'
import album from './modules/album'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    global: {
      namespaced: true,
      ...global,
    },
    user: {
      namespaced: true,
      ...user,
    },
    message: {
      namespaced: true,
      ...message,
    },
    album:{
      namespaced: true,
      ...album
    }
  }
})

export default store