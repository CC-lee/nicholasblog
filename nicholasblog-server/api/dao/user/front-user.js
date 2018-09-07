var User = require('../../../model/mongo').User
var UserList = require('../../../model/mongo').UserList
var UserOrder = require('../../../model/mongo').UserOrder
var UserNotify = require('../../../model/mongo').UserNotify
var UnReadNotify = require('../../../model/mongo').UnReadNotify
var ImageComment = require('../../../model/mongo').ImageComment
var ArticleComment = require('../../../model/mongo').ArticleComment
var Message = require('../../../model/mongo').Message
var MessagePreview = require('../../../model/mongo').MessagePreview
var MessageInfo = require('../../../model/mongo').MessageInfo
var MessageComment = require('../../../model/mongo').MessageComment
var MessageCommentReply = require('../../../model/mongo').MessageCommentReply
var ArticleCommentReply = require('../../../model/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建用户
  createUser: (user) => {
    return Promise.all([User.create(user)])
  },
  // 创建用户信息
  userlistCreate: (userlist) => {
    return Promise.all([UserList.create(userlist)])
  },
  // 获取
  // 获取用户账户信息
  getUser: (email) => {
    return User.findOne({ email: email })
  },
  getUserName: (name) => {
    return User.findOne({ user_name: name })
  },
  getUserLists: () => {
    return UserList.find().sort({ _id: -1 })
  },
  // 获取订单列表
  getOrderList: (userId) => {
    return UserOrder.find({ user_id: userId }).sort({ create_date: -1 })
  },
  // 获取一个订单
  getOrder: (orderId) => {
    return UserOrder.findOne({ _id: orderId })
  },
  // 获取未读通知数量
  getUnReadNotify: (userId) => {
    return UnReadNotify.count({ receiver_id: userId })
  },
  // 获取通知列表
  getNotify: (userId) => {
    return UserNotify.find({ user_id: userId }).sort({ create_date: -1 })
  },
  // 更新
  // 更新用户账户信息
  updateUser: (userId, account, userinfo, userlist) => {
    if (userinfo.user_name) {
      return Promise.all([
        ImageComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        ArticleComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        ArticleCommentReply.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        Message.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        MessagePreview.update({ user_id: userId }, { $set: { user_name: userinfo.user_name } }, { multi: true }),
        MessageInfo.update({ user_id: userId }, { $set: { user_name: userinfo.user_name } }, { multi: true }),
        MessageComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        MessageCommentReply.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        UserList.update({ userid: userId }, { $set: userlist }),
        User.update({ _id: userId }, { $set: account })
      ])
    } else {
      return Promise.all([
        ImageComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        ArticleComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        ArticleCommentReply.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        Message.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        MessageComment.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        MessageCommentReply.update({ user_id: userId }, { $set: userinfo }, { multi: true }),
        UserList.update({ userid: userId }, { $set: userlist }),
        User.update({ _id: userId }, { $set: account })
      ])
    }
  },
  // 更新用户列表信息
  updateUserList: (userId, userlist) => {
    return Promise.all([UserList.update({ user_id: userId }, { $set: userlist })])
  },
  // 更新用户密码
  updatePassword: (userId, password) => {
    return Promise.all([User.update({ _id: userId }, { $set: password })])
  },
  // 删除
  // 删除一个订单
  deleteOrder: (orderId) => {
    return Promise.all([UserOrder.remove({ _id: orderId })])
  },
  // 删除一条通知
  deleteNotify: (notifyId) => {
    return Promise.all([UserNotify.remove({ _id: notifyId })])
  },
  // 清空未读信息
  deleteUnReadNotify: (userId) => {
    return Promise.all([UnReadNotify.remove({ receiver_id: userId })])
  }
}

