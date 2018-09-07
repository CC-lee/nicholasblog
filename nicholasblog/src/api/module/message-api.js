import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
var instance = axapi.instance
var front_instance = axapi.front_instance
import common from './common-api';

var url = new common.Urlexe('message')
var headerSet = common.headerSet

export default {
  // 获取
  // 获取留言列表
  messageList(data) {
    return instance.post(url.exe('messageList'), data, headerSet())
  },
  // 获取一条留言
  getOneMessage(data) {
    return instance.post(url.exe('getOneMessage'), data, headerSet())
  },
  // 获取所有留言评论
  getAllComments(data) {
    return instance.post(url.exe('frontAllComments'), data, headerSet())
  },
  // 根据搜索结果获取留言
  getMessagesBySearch(data) {
    return instance.post(url.exe('getMessagesBySearch'), data, headerSet())
  },

  messagePreview(data) {
    return instance.post(url.exe('messagePreview'), data)
  },

  // 发送 登录功能
  // 用户留言创建
  userMessageCreate(data) {
    return instance.post(url.exe('userMessageCreate'), data, headerSet())
  },
  // 发送留言赞
  messageLike(data) {
    return instance.post(url.exe('messageLike'), data, headerSet())
  },
  // 留言赞取消
  messageLikeCancel(data) {
    return instance.post(url.exe('messageLikeCancel'), data, headerSet())
  },
  // 发送留言评论
  messageComment(data) {
    return instance.post(url.exe('messageComment'), data, headerSet())
  },
  // 发送留言评论赞
  commentLike(data) {
    return instance.post(url.exe('commentLike'), data, headerSet())
  },
  // 留言评论赞取消
  commentLikeCancel(data) {
    return instance.post(url.exe('commentLikeCancel'), data, headerSet())
  },
  // 留言评论回复
  messageReply(data) {
    return instance.post(url.exe('messageReply'), data, headerSet())
  }
}