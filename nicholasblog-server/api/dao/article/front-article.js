var Article = require('../../../model/mongo').Article
var ArticleLike = require('../../../model/mongo').ArticleLike
var ArticlePreview = require('../../../model/mongo').ArticlePreview
var ArticleInfo = require('../../../model/mongo').ArticleInfo
var ArticleComment = require('../../../model/mongo').ArticleComment
var ArticleCommentLike = require('../../../model/mongo').ArticleCommentLike
var ArticleCommentReply = require('../../../model/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建评论
  createComment: (comment) => {
    return Promise.all([
      ArticleComment.create(comment)
    ])
  },
  // 创建回复
  createReply: (reply) => {
    return Promise.all([
      ArticleCommentReply.create(reply)
    ])
  },
  // 创建文章赞
  createLike: (like) => {
    return Promise.all([
      ArticleLike.create(like)
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      ArticleCommentLike.create(commentLike)
    ])
  },
  // 获取
  // 获取所有文章预览，带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ArticlePreview.find({ classify: { $ne: '置顶' } }).sort({ create_date: -1 }).skip(skip).limit(limit),
        ArticlePreview.count({ classify: { $ne: '置顶' } })
      ])
    } else {
      return ArticlePreview.find({ classify: { $ne: '置顶' } }).sort({ create_date: -1 })
    }
  },
  getTopPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ArticlePreview.find({ classify: '置顶' }).sort({ create_date: -1 }).skip(skip).limit(limit),
        ArticlePreview.count({ classify: '置顶' })
      ])
    } else {
      return ArticlePreview.find({ classify: '置顶' }).sort({ create_date: -1 })
    }
  },
  // 根据关键字获取文章集合，带分页
  getArticlesBySearch: (key, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Article.find({ $or: key }).sort({ create_date: -1 }).skip(skip).limit(limit),
        Article.count({ $or: key })
      ])
    } else {
      return Article.find({ $or: key }).sort({ create_date: -1 })
    }
  },
  getResumeArticles:()=>{
    return Article.find({ classify: 'Resume' }).sort({ create_date: -1 })
  },
  // 获取一个预览
  getOnePreview: (articleId) => {
    return ArticlePreview.findOne({ article_id: articleId })
  },
  // 获取文章
  getArticle: (articleId) => {
    return Article.findOne({ _id: articleId })
  },
  // 获取评论
  getComment: (articleId) => {
    return ArticleComment.find({ article_id: articleId }).sort({ timestamp: -1 })
  },
  // 获取回复
  getReply: (commentId) => {
    return ArticleCommentReply.find({ comment_id: `${commentId}` }).sort({ timestamp: -1 })
  },
  // 获取文章赞
  getLike: (userid, articleId) => {
    if (articleId) {
      return ArticleLike.find({ user_id: userid, article_id: articleId })
    } else {
      return ArticleLike.find({ user_id: userid })
    }
  },
  // 获取评论赞
  getCommentLike: (userid) => {
    return ArticleCommentLike.find({ user_id: userid })
  },
  // 计算评论数
  countComments: (articleId) => {
    return Promise.all([
      ArticleComment.count({ article_id: articleId }),
      ArticleCommentReply.count({ article_id: articleId })
    ])
  },
  // 计算赞数
  countLikes: (articleId) => {
    return ArticleLike.count({ article_id: articleId })
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return ArticleCommentLike.count({ comment_id: commentId })
  },
  // 更新
  // 更新评论数
  updateCommentNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }),
      ArticlePreview.update({ article_id: articleId }, { $set: num }),
      ArticleInfo.update({ article_id: articleId }, { $set: num })
    ])
  },
  // 更新文章赞数
  updateLikeNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }),
      ArticlePreview.update({ article_id: articleId }, { $set: num }),
      ArticleInfo.update({ article_id: articleId }, { $set: num })
    ])
  },
  // 更新文章评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([ArticleComment.update({ _id: commentId }, { $set: num })])
  },
  // 删除
  // 删除赞
  deleteLike: function ({ articleId, userId }) {
    return ArticleLike.remove({ article_id: articleId, user_id: userId })
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      ArticleCommentLike.remove({ comment_id: commentId, user_id: userId })
    ])
  }
}
