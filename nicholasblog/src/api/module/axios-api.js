// 各种api
// 负责用instance和服务端进行交互
import axios from 'axios'
// axios.defaults.headers.common['Authorization'] = 'dailu';
axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create()
const front_instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/json'

export default {
  instance: instance,
  front_instance: front_instance
}