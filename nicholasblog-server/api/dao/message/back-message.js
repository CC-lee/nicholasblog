var Message = require('../../../model/mongo').Message
var MessageComment = require('../../../model/mongo').MessageComment
var MessageCommentReply = require('../../../model/mongo').MessageCommentReply
var MessageLike = require('../../../model/mongo').MessageLike
var MessageCommentLike = require('../../../model/mongo').MessageCommentLike
var MessagePreview = require('../../../model/mongo').MessagePreview
var MessageInfo = require('../../../model/mongo').MessageInfo
var MessageTemp = require('../../../model/mongo').MessageTemp
var UserNotify = require('../../../model/mongo').UserNotify
var UnReadNotify = require('../../../model/mongo').UnReadNotify

module.exports = {
  // 创建
  // 创建留言
  createMessage: (message, { tempId, temp }) => {
    return Promise.all([
      Message.create(message),
      MessageTemp.update({ _id: tempId }, { $set: temp })
    ])
  },
  // 创建预览与信息
  createMessagePvIf: ({ preview, info }) => {
    return Promise.all([
      MessagePreview.create(preview),
      MessageInfo.create(info)
    ])
  },
  // 创建用户通知
  createUserNotify: ({ notify, unRead }) => {
    return Promise.all([
      UserNotify.create(notify),
      UnReadNotify.create(unRead)
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return MessageTemp.find().sort({ _id: -1 })
  },
  // 获取管理留言信息列表
  getAdminInfo: () => {
    return MessageInfo.find({ message_type: 'admin' }).sort({ create_date: -1 })
  },
  // 获取用户留言信息列表
  getUserInfo: () => {
    return MessageInfo.find({ message_type: 'user' }).sort({ create_date: -1 })
  },
  // 获取一条留言
  getMessage: (messageId) => {
    return Message.findOne({ _id: messageId })
  },
  // 获取评论
  getComment: (messageId) => {
    return MessageComment.find({ message_id: messageId }).sort({ timestamp: -1 })
  },
  // 获取回复
  getReply: (commentId) => {
    return MessageCommentReply.find({ comment_id: `${commentId}` }).sort({ timestamp: -1 })
  },
  // 计算评论数
  countComments: (messageId) => {
    return Promise.all([
      MessageComment.count({ message_id: messageId }),
      MessageCommentReply.count({ message_id: messageId })
    ])
  },
  // 更新
  // 更新留言临时数据
  updateTemp: ({ tempId, temp }) => {
    return MessageTemp.update({ _id: tempId }, { $set: temp })
  },
  // 更新留言
  updateMessage: (messageId, { message, preview, info }) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: message }),
      MessagePreview.update({ message_id: messageId }, { $set: preview }),
      MessageInfo.update({ message_id: messageId }, { $set: info })
    ])
  },
  updateCommentNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }),
      MessageInfo.update({ message_id: messageId }, { $set: num })
    ])
  },
  // 更新评论数
  // 删除
  // 删除留言
  deleteMessage: (messageId) => {
    return Promise.all([
      Message.remove({ _id: messageId }),
      MessageComment.remove({ message_id: messageId }),
      MessageLike.remove({ message_id: messageId }),
      MessageCommentLike.remove({ message_id: messageId }),
      MessageCommentReply.remove({ message_id: messageId }),
      MessagePreview.remove({ message_id: messageId }),
      MessageInfo.remove({ message_id: messageId }),
    ])
  },
  // 删除评论
  deleteComment: (commentId, messageId, num) => {
    return Promise.all([
      MessageComment.remove({ _id: commentId }),
      MessageCommentLike.remove({ comment_id: commentId }),
      MessageCommentReply.remove({ comment_id: commentId })
    ])
  }
}
