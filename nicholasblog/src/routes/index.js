import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)
import routes from './routes'
// 滚动条滚回顶部
let scrollBehavior = (to, from, savedPosition) => {
  const messageposition = store.getters['message/getposition']
  const albumposition = store.getters['album/getposition']
  const messagestatus = store.getters['message/getstatus']
  if (messageposition) {
    return messageposition
  } else if (albumposition) {
    return albumposition
  }
  else if (messagestatus === 'searchReturn' || messagestatus === 'search') {
    if (from.name === 'messageboard' && to.name === 'messagesearch' && messagestatus === 'search') {
      return { x: 0, y: 0 }
    }
  }
  else if (to.hash) {
    return {
      selector: to.hash
    }
  }
  else if (to.name === 'messageboard' && from.path.search('messageboard') && from.hash === '#comment') {
    if (messageposition === 0) {
      return { x: 0, y: 0 }
    }
  }
  else if (from.path === '/about' && to.path === '/about') {
    return
  }
  else {
    return { x: 0, y: 0 }
  }
}

const router = new VueRouter({
  mode: 'history',
  scrollBehavior,
  routes
})


async function load() {
  await store.dispatch('global/isLogin')
  store.dispatch('global/getNum')
}

// 路由钩子
router.beforeEach(({ meta, path, params }, from, next) => {
  document.title = meta.title
  const token = store.getters['global/getToken']
  if (!token) {
    load()
  } else {

  }
  next()
})
export default router
