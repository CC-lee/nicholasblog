var Image = require('../../../model/mongo').Image
var ImageComment = require('../../../model/mongo').ImageComment
var ImageLike = require('../../../model/mongo').ImageLike
var ImageCommentLike = require('../../../model/mongo').ImageCommentLike
var ImagePreview = require('../../../model/mongo').ImagePreview
var ImageInfo = require('../../../model/mongo').ImageInfo
var ImageTemp = require('../../../model/mongo').ImageTemp
var common = {
  ImageTemp: require('../../../model/mongo').ImageTemp
}

module.exports = {
  // 创建
  // 创建图片
  createImage: (image, { tempId, temp }) => {
    return Promise.all([
      Image.create(image),
      ImageTemp.update({ _id: tempId }, { $set: temp })
    ])
  },
  // 创建预览与信息
  createImagePvIf: ({ preview, info }) => {
    return Promise.all([
      ImagePreview.create(preview),
      ImageInfo.create(info)
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: function () {
    return common['ImageTemp'].find().sort({ _id: -1 })
  },
  // 获取信息列表
  getInfo: () => {
    return ImageInfo.find().sort({ _id: -1 })
  },
  // 获取图片
  getImage: (imageId) => {
    return Image.findOne({ _id: imageId })
  },
  // 获取评论
  getComment: (imageId) => {
    return ImageComment.find({ image_id: imageId }).sort({ timestamp: -1 })
  },
  countComments: (imageId) => {
    return ImageComment.count({ image_id: imageId })
  },
  // 更新
  // 更新图片临时数据
  updateTemp: ({ tempId, temp }) => {
    return ImageTemp.update({ _id: tempId }, { $set: temp })
  },
  // 更新图片
  updateImage: (imageId, { image, preview, info }) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: image }),
      ImagePreview.update({ image_id: imageId }, { $set: preview }),
      ImageInfo.update({ image_id: imageId }, { $set: info })
    ])
  },
  // 更新评论数
  updateCommentNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }),
      ImagePreview.update({ image_id: imageId }, { $set: num }),
      ImageInfo.update({ image_id: imageId }, { $set: num })
    ])
  },
  // 删除
  // 删除图片
  deleteImage: (imageId) => {
    return Promise.all([
      Image.remove({ _id: imageId }),
      ImageComment.remove({ image_id: imageId }),
      ImageLike.remove({ image_id: imageId }),
      ImageCommentLike.remove({ image_id: imageId }),
      ImagePreview.remove({ image_id: imageId }),
      ImageInfo.remove({ image_id: imageId })
    ])
  },
  // 删除评论
  deleteComment: (commentId) => {
    return Promise.all([
      ImageComment.remove({ _id: commentId }),
      ImageCommentLike.remove({ comment_id: commentId }),
    ])
  }
}
