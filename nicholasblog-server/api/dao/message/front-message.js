var Message = require('../../../model/mongo').Message
var MessageComment = require('../../../model/mongo').MessageComment
var MessageCommentReply = require('../../../model/mongo').MessageCommentReply
var MessageLike = require('../../../model/mongo').MessageLike
var MessageCommentLike = require('../../../model/mongo').MessageCommentLike
var MessagePreview = require('../../../model/mongo').MessagePreview
var MessageInfo = require('../../../model/mongo').MessageInfo
var UserNotify = require('../../../model/mongo').UserNotify
var UnReadNotify = require('../../../model/mongo').UnReadNotify

module.exports = {
  // 创建
  // 创建留言
  createMessage: (message) => {
    return Promise.all([Message.create(message)])
  },
  // 创建预览与信息
  createMessagePvIf: ({ preview, info }) => {
    return Promise.all([
      MessagePreview.create(preview),
      MessageInfo.create(info)
    ])
  },
  // 创建用户通知
  createUserNotify: (notify, unRead) => {
    return Promise.all([
      UnReadNotify.create(unRead),
      UserNotify.create(notify)
    ])
  },
  // 创建评论
  createComment: (comment) => {
    return Promise.all([
      MessageComment.create(comment)
    ])
  },
  // 创建回复
  createReply: (reply) => {
    return Promise.all([
      MessageCommentReply.create(reply)
    ])
  },
  // 创建留言赞
  createLike: (like) => {
    return Promise.all([
      MessageLike.create(like)
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      MessageCommentLike.create(commentLike)
    ])
  },
  // 获取
  // 获取所有部分留言预览
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        MessagePreview.find().sort({ create_date: -1 }).skip(skip).limit(limit),
        MessagePreview.count()
      ])
    } else {
      return MessagePreview.find().sort({ create_date: -1 })
    }
  },
  // 获取所有留言集合，带分页
  getAllMessage: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Message.find().sort({ create_date: -1 }).skip(skip).limit(limit),
        Message.count()
      ])
    } else {
      return Message.find().sort({ _id: -1 })
    }
  },
  // 获取留言
  getMessage: (messageId) => {
    return Message.findOne({ _id: messageId })
  },
  // 根据关键字获取留言集合,带分页
  getMessagesBySearch: (key, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Message.find({ $or: key }).sort({ create_date: -1 }).skip(skip).limit(limit),
        Message.count({ $or: key } )
      ])
    } else {
      return Message.find({ $or: key }).sort({ create_date: -1 })
    }
  },
  // 获取评论
  getComment: (messageId) => {
    return MessageComment.find({ message_id: messageId }).sort({ _id: -1 })
  },
  // 获取回复
  getReply: (commentId) => {
    return MessageCommentReply.find({ comment_id: `${commentId}` }).sort({ _id: -1 })
  },
  // 获取留言赞
  getLike: (userid, messageId) => {
    if (messageId) {
      return MessageLike.find({ user_id: userid, message_id: messageId })
    } else {
      return MessageLike.find({ user_id: userid })
    }
  },
  // 获取评论赞
  getCommentLike: (userid) => {
    return MessageCommentLike.find({ user_id: userid })
  },
  // 计算评论数
  countComments: (messageId) => {
    return Promise.all([
      MessageComment.count({ message_id: messageId }),
      MessageCommentReply.count({ message_id: messageId })
    ])
  },
  // 计算赞数
  countLikes: (messageId) => {
    return MessageLike.count({ message_id: messageId })
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return MessageCommentLike.count({ comment_id: commentId })
  },
  // 更新
  // 更新评论数
  updateCommentNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }),
      MessageInfo.update({ message_id: messageId }, { $set: num })
    ])
  },
  // 更新留言赞数
  updateLikeNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }),
      MessageInfo.update({ message_id: messageId }, { $set: num })
    ])
  },
  // 更新留言评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([MessageComment.update({ _id: commentId }, { $set: num })])
  },
  // 删除
  // 删除赞
  deleteLike: ({ messageId, userId }) => {
    return MessageLike.remove({ message_id: messageId, user_id: userId })
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      MessageCommentLike.remove({ comment_id: commentId, user_id: userId })
    ])
  }
}
