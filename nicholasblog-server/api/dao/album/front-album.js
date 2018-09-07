var Image = require('../../../model/mongo').Image
var ImageComment = require('../../../model/mongo').ImageComment
var ImageLike = require('../../../model/mongo').ImageLike
var ImageCommentLike = require('../../../model/mongo').ImageCommentLike
var ImagePreview = require('../../../model/mongo').ImagePreview
var ImageInfo = require('../../../model/mongo').ImageInfo
var ImageTemp = require('../../../model/mongo').ImageTemp

module.exports = {
  // 创建
  // 创建评论
  createComment: (imageId, comment) => {
    return Promise.all([
      ImageComment.create(comment),
      ImageComment.count({ image_id: imageId })
    ])
  },
  //创建图片赞
  createLike: (like) => {
    return Promise.all([
      ImageLike.create(like),
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      ImageCommentLike.create(commentLike),
    ])
  },
  // 获取
  // 获取图片
  getImage: (imageId) => {
    return Image.findOne({ _id: imageId })
  },
  // 获取评论
  getComment: (imageId) => {
    return ImageComment.find({ image_id: imageId }).sort({ timestamp: -1 })
  },
  // 获取预览，带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ImagePreview.find().sort({ create_date: -1 }).skip(skip).limit(limit),
        ImagePreview.count()
      ])
    } else {
      return ImagePreview.find().sort({ create_date: -1 })
    }
  },
  // 获取文章赞
  getLike: (userid, imageId) => {
    return ImageLike.find({ user_id: userid, image_id: imageId })
  },
  // 获取评论赞
  getCommentLike: (userid, imageId) => {
    return ImageCommentLike.find({ user_id: userid, image_id: imageId })
  },
  // 计算评论数
  countComments: (imageId) => {
    return ImageComment.count({ image_id: imageId })
  },
  // 计算赞数
  countLikes: (imageId) => {
    return ImageLike.count({ image_id: imageId })
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return ImageCommentLike.count({ comment_id: commentId })
  },
  // 更新
  // 更新评论数
  updateCommentNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }),
      ImagePreview.update({ image_id: imageId }, { $set: num }),
      ImageInfo.update({ image_id: imageId }, { $set: num })
    ])
  },
  // 更新图片赞数
  updateLikeNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }),
      ImagePreview.update({ image_id: imageId }, { $set: num }),
      ImageInfo.update({ image_id: imageId }, { $set: num })
    ])
  },
  // 更新图片评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([ImageComment.update({ _id: commentId }, { $set: num })])
  },
  // 删除
  // 删除赞
  deleteLike: ({ imageId, userId }) => {
    return Promise.all([
      ImageLike.remove({ image_id: imageId, user_id: userId }),
      ImageLike.count({ image_id: imageId })
    ])
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      ImageCommentLike.remove({ comment_id: commentId, user_id: userId }),
      ImageCommentLike.count({ _id: commentId })
    ])
  }
}
