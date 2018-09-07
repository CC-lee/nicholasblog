import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
var instance = axapi.instance
var front_instance = axapi.front_instance
import common from './common-api';

var url = new common.Urlexe('classify')

export default {
  // 获取
  // 获取所有分类
  classList() {
    return instance.get(url.exe('classifyList'))
  },
  // 获取特定分类
  specificClassList(data) {
    return instance.post(url.exe('specificClassList'), data)
  },
  // 根据分类获取文章
  getArticlesByClass(data) {
    return instance.post(url.exe('getArticlesByClass'), data)
  }
}