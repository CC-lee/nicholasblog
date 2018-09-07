var apimodule = require('../../dao'),
  frontArticle = apimodule.frontArticle,
  _ = require('lodash'),
  control = require('../control'),
  commonControl = require('../common-control'),
  filePrefix = commonControl.commonSet.filePrefix,
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string')),
  { Rx } = require('rxjs'),
  { Observable } = require('rxjs/Observable'),
  { Subject } = require('rxjs/Subject'),
  { BehaviorSubject } = require('rxjs/BehaviorSubject'),
  { from } = require('rxjs'),
  { defer } = require('rxjs/observable/defer'),
  { of } = require('rxjs/observable/of'),
  { fromPromise } = require('rxjs/observable/fromPromise'),
  { concatMap, mergeMap, pluck, flatMap, last, map, find, filter,
    partition, concat, toArray, tap, scan, isEmpty, zip, combineLatest,
    shareReplay, refCount, publishReplay } = require('rxjs/operators')


class fArticle extends control {
  constructor({
    _id,
    article_id,
    key,
    page,
    limit,
    like_num,
    content,
    like_status,
    like_type,
    target_id,
    user_id,
    user_avatar,
    user_name,
    comment_id,
    reply_user_id,
    reply_user_avatar,
    reply_user_name,
    create_date,
    update_date,
    timestamp,
    time
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      comment_id,
      reply_user_id,
      reply_user_avatar,
      reply_user_name,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, article_id, page, limit, key })

    this.comment = {
      article_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      like_num,
      content,
      like_status,
      time,
      timestamp: this.timestamp
    }
    this.reply = {
      article_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      comment_id: `${this.comment_id}`,
      reply_user_id: this.reply_user_id,
      reply_user_avatar: this.reply_user_avatar,
      reply_user_name: this.reply_user_name,
      content,
      time,
      timestamp: this.timestamp
    }
    this.like = {
      article_id,
      user_id: this.user_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.commentLike = {
      article_id,
      user_id: this.user_id,
      comment_id: this.comment_id,
      target_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }


  }
  async  articlePreview(res) {
    if (this.user_id) {
      await frontArticle.getLike(this.user_id, this.article_id).then(async (result) => {
        var likes = result
        var data = []
        if (this.page === 1) {
          await frontArticle.getTopPreview({ page: this.page, limit: this.limit })
            .then((result) => {
              var preview = result[0]
              if (preview.length > 0) {
                for (var i = 0; i < preview.length; i++) {
                  if (preview[i]['theme_img']) {
                    urlAddObject(preview[i], 'theme_img')
                  }
                  if (preview[i].like_num > 0 && likes && likes.length > 0) {
                    for (var x = 0; x < likes.length; x++) {
                      if (likes[x].user_id === this.user_id && likes[x].article_id === preview[i].article_id) {
                        preview[i].like_status = true
                      }
                    }
                  }
                }
                data = preview
              }
            })
        }
        await frontArticle.getPreview({ page: this.page, limit: this.limit })
          .then((result) => {
            var preview = result[0],
              total = result[1],
              //data = [],
              totalPage = Math.ceil(total / this.limit),
              hasNext = totalPage > this.page ? 1 : 0
            for (var i = 0; i < preview.length; i++) {
              if (preview[i]['theme_img']) {
                urlAddObject(preview[i], 'theme_img')
              }
              if (preview[i].like_num > 0 && likes && likes.length > 0) {
                for (var x = 0; x < likes.length; x++) {
                  if (likes[x].user_id === this.user_id && likes[x].article_id === preview[i].article_id) {
                    preview[i].like_status = true
                  }
                }
              }
              /** if (preview[i].classify === '置顶') {
                 data.push(preview[i])
               }**/
            }
            if (data.length > 0) {
              /** _.remove(preview, function (n) {
                 return n.classify === '置顶';
               })**/
              preview = data.concat(preview)
            }
            setTimeout(function () {
              res.send({
                code: 200,
                preview: preview,
                hasNext: hasNext,
                timestamp: `${new Date().getTime()}`
              })
            }, 200)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
    } else {
      var data = []
      if (this.page === 1) {
        await frontArticle.getTopPreview({ page: this.page, limit: this.limit })
          .then((result) => {
            var preview = result[0]
            if (preview.length > 0) {
              for (var i = 0; i < preview.length; i++) {
                if (preview[i]['theme_img']) {
                  urlAddObject(preview[i], 'theme_img')
                }
              }
              data = preview
            }
          })
      }
      await frontArticle.getPreview({ page: this.page, limit: this.limit })
        .then((result) => {
          var preview = result[0],
            total = result[1],
            totalPage = Math.ceil(total / this.limit),
            hasNext = totalPage > this.page ? 1 : 0
          for (var i = 0; i < preview.length; i++) {
            if (preview[i]['theme_img']) {
              urlAddObject(preview[i], 'theme_img')
            }
            /** if (preview[i].classify === '置顶') {
               data.push(preview[i])
             }**/
          }
          if (data.length > 0) {
            /** _.remove(preview, function (n) {
               return n.classify === '置顶';
             })**/
            preview = data.concat(preview)
          }
          res.send({
            code: 200,
            preview: preview,
            hasNext: hasNext
          })
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  articleLike(res) {
    var num = { like_num: '' }
    frontArticle.createLike(this.like)
      .then((result) => {
        frontArticle.countLikes(this.article_id).then((result) => {
          num.like_num = result
          frontArticle.updateLikeNum(this.article_id, num)
            .then((result) => {
              setTimeout(() => {
                this.updateres(result, res)
              }, 100)
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleLikeCancel(res) {
    var num = { like_num: '' }
    frontArticle.deleteLike({ articleId: this.article_id, userId: this.user_id })
      .then((result) => {
        frontArticle.countLikes(this.article_id).then((result) => {
          num.like_num = result
          frontArticle.updateLikeNum(this.article_id, num)
            .then((result) => {
              setTimeout(() => {
                this.updateres(result, res)
              }, 100)
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneArticle(res) {
    var fileReg = RegExp(filePrefix, 'gim')
    var prefixReg = RegExp(`article/${this.article_id}/`, 'gim')
    if (this.user_id) {
      frontArticle.getLike(this.user_id, this.article_id).then((result) => {
        var like = result[0]
        frontArticle.getArticle(this.article_id)
          .then((article) => {
            if (like && like.user_id == this.user_id) {
              article.like_status = true
            }
            if (article.content) {
              article.content = article.content
                .replace(/articleId/ig, `${this.article_id}`)
                .replace(fileReg, '')
                .replace(prefixReg, `${filePrefix}article/${this.article_id}/`)
            }
            this.getres(article, res)
          },
          err => {
            this.fail(res, err)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
        .catch(err => {
          this.fail(res, err)
        })
    } else {
      frontArticle.getArticle(this.article_id)
        .then((article) => {
          if (article.content) {
            article.content = article.content
              .replace(/articleId/gi, `${this.article_id}`)
              .replace(fileReg, '')
              .replace(prefixReg, `${filePrefix}article/${this.article_id}/`)
          }
          this.getres(article, res)
        },
        err => {
          this.fail(res, err)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  getAllComments(res) {
    frontArticle.getCommentLike(this.user_id).then((result) => {
      var commentlikes = result
      frontArticle.getComment(this.article_id)
        .then(async (comments) => {
          for (var i = 0; i < comments.length; i++) {
            urlAddObject(comments[i], 'user_avatar')
            if (commentlikes && commentlikes.length > 0 && comments[i].like_num > 0) {
              for (var x = 0; x < commentlikes.length; x++) {
                if (commentlikes[x].user_id == this.user_id && `${commentlikes[x].comment_id}` === `${comments[i]._id}`) {
                  comments[i].like_status = true
                  await this.getReply(comments[i], res)
                }
              }
            }
            else {
              await this.getReply(comments[i], res)
            }
          }
          res.send({
            code: 200,
            comments
          })
        })
        .catch(err => {
          this.fail(res, err)
        })
    })
      .catch(err => {
        this.fail(res, err)
      })
  }
  // getAllComments的内嵌函数
  async  getReply(comment, res) {
    await frontArticle.getReply(comment._id)
      .then((reply) => {
        if (reply.length > 0) {
          urlAddArray(reply, ['user_avatar', 'reply_user_avatar'])
        }
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleComment(res) {
    urlReplaceObject(this.comment, 'user_avatar')
    frontArticle.createComment(this.comment)
      .then((result) => {
        var comment = result[0]
        frontArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontArticle.updateCommentNum(this.article_id, num)
            .then((result) => {
              var { ok, n } = result.slice(-1)[0]
              if (ok && n > 0) {
                res.send({
                  code: 200,
                  comment: comment,
                  message: '编辑成功'
                })
              } else {
                throw new Error('编辑失败');
              }
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  commentLikeCreate(res) {
    var num = { like_num: '' }
    frontArticle.createCommentLike(this.commentLike)
      .then((result) => {
        frontArticle.countCommentLikes(this.comment_id).then((result) => {
          num.like_num = result
          frontArticle.updateCommentLikeNum(this.comment_id, num)
            .then((result) => {
              setTimeout(() => {
                this.updateres(result, res)
              }, 100);
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  commentLikeCancel(res) {
    frontArticle.deleteCommentLike({ commentId: this.comment_id, userId: this.user_id })
      .then((result) => {
        frontArticle.countCommentLikes(this.comment_id).then((result) => {
          var num = Object.assign({}, { like_num: result })
          frontArticle.updateCommentLikeNum(this.comment_id, num)
            .then((result) => {
              this.updateres(result, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleReply(res) {
    urlReplaceObject(this.reply, ['user_avatar', 'reply_user_avatar'])
    frontArticle.createReply(this.reply)
      .then((result) => {
        var reply = result[0]
        frontArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontArticle.updateCommentNum(this.article_id, num)
            .then((result) => {
              var { ok, n } = result.slice(-1)[0]
              if (ok && n > 0) {
                res.send({
                  code: 200,
                  reply: reply,
                  message: '编辑成功'
                })
              } else {
                throw new Error('编辑失败');
              }
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getArticlesBySearch(res) {
    frontArticle.getArticlesBySearch(this.key, this.page, this.limit)
      .then((result) => {
        var preview = [];
        var articles = result[0],
          total = result[1],
          totalPage = Math.ceil(total / this.limit),
          hasNext = totalPage > this.page ? 1 : 0;
        for (var i = 0, len = articles.length; i < len; i++) {
          frontArticle.getOnePreview(`${articles[i]._id}`).then((result) => {
            if (result['theme_img']) {
              urlAddObject(result, 'theme_img')
            }
            preview.push(result)
          })
        }
        setTimeout(function () {
          res.send({
            code: 200,
            preview: preview,
            hasNext: hasNext
          })
        }, 200);
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 文章预览
  articlePreview: connectFun('articlePreview', fArticle),
  // 发送文章赞
  articleLike: connectFun('articleLike', fArticle),
  // 取消文章赞
  articleLikeCancel: connectFun('articleLikeCancel', fArticle),
  // 获取一篇文章
  getOneArticle: connectFun('getOneArticle', fArticle),
  // 获取所有评论
  getAllComments: connectFun('getAllComments', fArticle),
  // 发送评论
  articleComment: connectFun('articleComment', fArticle),
  // 发送评论点赞
  commentLike: connectFun('commentLikeCreate', fArticle),
  // 取消评论点赞
  commentLikeCancel: connectFun('commentLikeCancel', fArticle),
  // 发送回复
  articleReply: connectFun('articleReply', fArticle),
  // 获取搜索文章列表
  getArticlesBySearch: connectFun('getArticlesBySearch', fArticle),
}
