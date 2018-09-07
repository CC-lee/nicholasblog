var User = require('../../../model/mongo').User
var UserOrder = require('../../../model/mongo').UserOrder
var UserNotify = require('../../../model/mongo').UserNotify
var UnReadNotify = require('../../../model/mongo').UnReadNotify
var ImageComment = require('../../../model/mongo').ImageComment
var ArticleComment = require('../../../model/mongo').ArticleComment
var MessageComment = require('../../../model/mongo').MessageComment
var ArticleLike = require('../../../model/mongo').ArticleLike
var ArticleCommentLike = require('../../../model/mongo').ArticleCommentLike
var MessageLike = require('../../../model/mongo').MessageLike
var MessageCommentLike = require('../../../model/mongo').MessageCommentLike
var ImageLike = require('../../../model/mongo').ImageLike
var ImageCommentLike = require('../../../model/mongo').ImageCommentLike
var MessageCommentReply = require('../../../model/mongo').MessageCommentReply
var ArticleCommentReply = require('../../../model/mongo').ArticleCommentReply
var CartInfo = require('../../../model/mongo').CartInfo

module.exports = {
  // 创建
  // 获取
  // 获取所有用户信息列表
  getUserList: () => {
    return User.find().sort({ create_date: -1 })
  },
  // 更新
  //
  // 删除
  // 删除用户
  deleteUser: (userId) => {
    return Promise.all([
      User.remove({ _id: userId }),
      UserOrder.remove({ user_id: userId }),
      UserNotify.remove({ user_id: userId }),
      ImageComment.remove({ user_id: userId }),
      ArticleComment.remove({ user_id: userId }),
      MessageComment.remove({ user_id: userId }),
      ArticleLike.remove({ user_id: userId }),
      ArticleCommentLike.remove({ user_id: userId }),
      ArticleCommentLike.remove({ target_id: userId }),
      MessageLike.remove({ user_id: userId }),
      MessageCommentLike.remove({ user_id: userId }),
      MessageCommentLike.remove({ target_id: userId }),
      ImageLike.remove({ user_id: userId }),
      ImageCommentLike.remove({ user_id: userId }),
      ImageCommentLike.remove({ target_id: userId }),
      MessageCommentReply.remove({ user_id: userId }),
      ArticleCommentReply.remove({ user_id: userId }),
      MessageCommentReply.remove({ reply_user_id: userId }),
      ArticleCommentReply.remove({ reply_user_id: userId }),
      CartInfo.remove({ user_id: userId }),
      UnReadNotify.remove({ receiver_id: userId })
    ])
  },
  // 更新所有因删除用户所带来的改变
  updateAll: () => {

  }
}

