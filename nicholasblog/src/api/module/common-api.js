import store from '../../store'
import execlib from '../../lib/execlib'

function urlexe(url) {
  return function (str) {
    return `/${execlib.apiName}/${url}/${str}`
  }
}

class Urlexe {
  constructor(url) {
    this.url = url
  }
  exe(str){
    return `/${execlib.apiName}/${this.url}/${str}`
  }
}

function headerSet() {
  if (localStorage.getItem(execlib.tokenName)) {
    return { headers: { authorization: localStorage.getItem(execlib.tokenName) } }
  } else {
    return { headers: { authorization: store.getters['global/getToken'] } }
  }
}

export default {
  urlexe,
  Urlexe,
  headerSet
}