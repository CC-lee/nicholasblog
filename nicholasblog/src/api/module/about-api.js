import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
import common from './common-api';
var instance = axapi.instance
var front_instance = axapi.front_instance

var url = new common.Urlexe('about')
var headerSet = common.headerSet

export default {
  // 获取
  getAbout(data) {
    return instance.post(url.exe('aboutList'), data)
  }
}