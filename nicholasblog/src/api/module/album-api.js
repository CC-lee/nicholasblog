import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
import common from './common-api';
var instance = axapi.instance
var front_instance = axapi.front_instance

var url = new common.Urlexe('album')
var headerSet = common.headerSet

export default {
  // 获取
  // 获取相册列表
  albumList(data) {
    return instance.post(url.exe('albumList'), data)
  },
  // 获取一张图片
  getOneImage(data) {
    return instance.post(url.exe('frontOneImage'), data, headerSet())
  },
  // 获取一张图片的全部评论
  getAllComments(data) {
    return instance.post(url.exe('frontAllComments'), data, headerSet())
  },

  // 发送 登录功能
  // 发送评论
  imageComment(data) {
    return instance.post(url.exe('imageComment'), data, headerSet())
  },
  // 图片赞
  imageLike(data) {
    return instance.post(url.exe('imageLike'), data, headerSet())
  },
  // 图片赞取消
  imageLikeCancel(data) {
    return instance.post(url.exe('imageLikeCancel'), data, headerSet())
  },
  // 评论点赞
  commentLike(data) {
    return instance.post(url.exe('commentLike'), data, headerSet())
  },
  // 评论赞取消
  commentLikeCancel(data) {
    return instance.post(url.exe('commentLikeCancel'), data, headerSet())
  }
}