var Article = require('../../../model/mongo').Article
var ArticleTemp = require('../../../model/mongo').ArticleTemp
var ArticleLike = require('../../../model/mongo').ArticleLike
var ArticlePreview = require('../../../model/mongo').ArticlePreview
var ArticleInfo = require('../../../model/mongo').ArticleInfo
var ArticleComment = require('../../../model/mongo').ArticleComment
var ArticleCommentLike = require('../../../model/mongo').ArticleCommentLike
var ArticleCommentReply = require('../../../model/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建文章
  createArticle: (article, { tempId, temp }) => {
    return Promise.all([
      Article.create(article),
      ArticleTemp.update({ _id: tempId }, { $set: temp })
    ])
  },
  // 创建预览与信息
  createArticlePvIf: ({ preview, info }) => {
    return Promise.all([
      ArticlePreview.create(preview),
      ArticleInfo.create(info)
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return ArticleTemp.find()
  },
  // 获取文章信息列表
  getInfo: () => {
    return ArticleInfo.find().sort({ update_date: -1 })
  },
  // 获取一篇文章
  getArticle: (articleId) => {
    var obj = { '_id': articleId }
    return Article.findOne(obj)
  },
  // 获取评论
  getComment: (articleId) => {
    return ArticleComment.find({ article_id: articleId }).sort({ timestamp: -1 })
  },
  // 获取回复
  getReply: (commentId) => {
    return ArticleCommentReply.find({ comment_id: `${commentId}` }).sort({ timestamp: -1 })
  },
  // 计算评论数
  countComments: (articleId) => {
    return Promise.all([
      ArticleComment.count({ article_id: articleId }),
      ArticleCommentReply.count({ article_id: articleId })
    ])
  },
  // 更新
  // 更新文章临时数据
  updateTemp: ({ tempId, temp }) => {
    var obj = {}
    var ids = '_id'
    obj[ids] = tempId
    return ArticleTemp.update(obj, { $set: temp })
  },
  // 更新文章
  updateArticle: (articleId, { article, preview, info }) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: article }),
      ArticleInfo.update({ article_id: articleId }, { $set: info }),
      ArticlePreview.update({ article_id: articleId }, { $set: preview })
    ])
  },
  // 更新评论数
  updateCommentNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }),
      ArticlePreview.update({ article_id: articleId }, { $set: num }),
      ArticleInfo.update({ article_id: articleId }, { $set: num })
    ])
  },
  // 删除
  // 删除文章
  deleteArticle: (articleId) => {
    return Promise.all([
      Article.remove({ _id: articleId }),
      ArticleComment.remove({ article_id: articleId }),
      ArticleLike.remove({ article_id: articleId }),
      ArticleCommentLike.remove({ article_id: articleId }),
      ArticleCommentReply.remove({ article_id: articleId }),
      ArticlePreview.remove({ article_id: articleId }),
      ArticleInfo.remove({ article_id: articleId })
    ])
  },
  // 删除评论
  deleteComment: (commentId) => {
    return Promise.all([
      ArticleComment.remove({ _id: commentId }),
      ArticleCommentLike.remove({ comment_id: commentId }),
      ArticleCommentReply.remove({ comment_id: commentId }),
    ])
  }
}

