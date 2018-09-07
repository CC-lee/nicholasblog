import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
var instance = axapi.instance
var front_instance = axapi.front_instance
import common from './common-api';

var url = new common.Urlexe('article')
var headerSet = common.headerSet

export default {
  // 获取
  // 获取文章预览列表
  articlePreview(data) {
    return instance.post(url.exe('articlePreview'), data)
  },
  // 获取一篇文章
  getOneArticle(data) {
    return instance.post(url.exe('frontOneArticle'), data)
  },
  // 获取所有评论
  getAllComments(data) {
    return instance.post(url.exe('frontAllComments'), data)
  },
  // 根据搜索结果获取文章
  getArticlesBySearch(data) {
    return instance.post(url.exe('getArticlesBySearch'), data)
  },

  // 发送 登录功能
  // 发送文章赞	
  articleLike(data) {
    return instance.post(url.exe('articleLike'), data, headerSet())
  },
  // 取消文章赞	
  articleLikeCancel(data) {
    return instance.post(url.exe('articleLikeCancel'), data, headerSet())
  },
  // 发送评论	
  articleComment(data) {
    return instance.post(url.exe('articleComment'), data, headerSet())
  },
  // 发送评论点赞	
  commentLike(data) {
    return instance.post(url.exe('commentLike'), data, headerSet())
  },
  // 取消评论点赞	
  commentLikeCancel(data) {
    return instance.post(url.exe('commentLikeCancel'), data, headerSet())
  },
  // 发送回复	
  articleReply(data) {
    return instance.post(url.exe('articleReply'), data, headerSet())
  }
}