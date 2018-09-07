var apimodule = require('../../dao'),
  frontMessage = apimodule.frontMessage,
  control = require('../control'),
  jetpack = require('fs-jetpack'),
  commonControl = require('../common-control'),
  _ = require('lodash'),
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
  { defer } = require('rxjs/observable/defer'),
  { concatMap, mergeMap, pluck, last, flatMap, switchMap, concatAll, map, find,
    filter, partition, concat, toArray, tap, scan, isEmpty, zip, combineLatest,
    shareReplay, refCount, publishReplay } = require('rxjs/operators')

class fMessage extends control {
  constructor({
    path,
    _id,
    message_id,
    key,
    page,
    limit,
    message_type,
    content,
    img,
    comment_num,
    like_num,
    like_status,
    message_preview,
    url,
    notify,
    sender_id,
    receiver_id,
    target_id,
    like_type,
    user_id,
    user_avatar,
    user_name,
    comment_id,
    reply_user_id,
    reply_user_avatar,
    reply_user_name,
    user_email,
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
      user_email,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, message_id, page, limit, img, notify, user_id, path, key })

    this.message = {
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      message_type,
      content,
      img,
      comment_num,
      like_num,
      like_status,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      message_id,
      message_preview,
      user_id: this.user_id,
      user_name: this.user_name,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      message_id,
      user_id: this.user_id,
      user_name: this.user_name,
      like_num,
      comment_num,
      message_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }

    this.comment = {
      message_id,
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
      message_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      comment_id: this.comment_id,
      reply_user_id: this.reply_user_id,
      reply_user_avatar: this.reply_user_avatar,
      reply_user_name: this.reply_user_name,
      content,
      time,
      timestamp: this.timestamp
    }
    this.like = {
      message_id,
      user_id: this.user_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.commentLike = {
      message_id,
      user_id: this.user_id,
      comment_id: this.comment_id,
      target_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }


  }

  messageList(res) {
    var that = this
    var messages = {
      data: [],
      hasNext: null,
      likes: []
    }
    //var messageSubject = new BehaviorSubject(JSON.parse(JSON.stringify(messages)));
    //var messageSource = messageSubject.asObservable();
    var messageSource = from(new Promise(resolve => resolve(JSON.parse(JSON.stringify(messages)))))
    messageSource.pipe(
      concatMap(obj => {
        var step1 = from(new Promise(resolve => resolve([])))
        var step2 = from(new Promise(resolve => resolve([])))
        if (this.user_id) {
          step1 = defer(() => {
            return frontMessage.getLike(this.user_id, this._id)
          })
            .pipe(concatMap(result => {
              obj.likes = result
              return of(obj)
            }))
        }
        step2 = defer(() => {
          return frontMessage.getAllMessage({ page: this.page, limit: this.limit })
        }).pipe(
          concatMap(result => {
            var messages = result[0],
              total = result[1],
              totalPage = Math.ceil(total / this.limit),
              hasNext = totalPage > this.page ? 1 : 0
            obj.hasNext = hasNext
            _.map(messages, message => {
              urlAddObject(message, 'user_avatar')
            })
            return of(messages)
          }),
          concatMap(messages => {
            if (messages.length > 0) {
              _.map(messages, message => {
                if (message.img.length > 0) {
                  if (message.message_type === "user") {
                    message.img = _.map(message.img, img => {
                      var arrs = img.match(/message\//g)
                      if (!arrs) {
                        img = `message/${message.user_id}/${message._id}/${img}`
                      }
                      return img = urlAddString(img)
                    })
                  } else {
                    message.img = _.map(message.img, img => {
                      var arrs = img.match(/message\//g)
                      if (!arrs) {
                        img = `message/${message._id}/${img}`
                      }
                      return img = urlAddString(img)
                    })
                  }
                }
                if (message.like_num > 0 && obj.likes.length > 0) {
                  _.map(obj.likes, like => {
                    if (like.user_id === this.user_id && `${like.message_id}` === `${message._id}`) {
                      message.like_status = true
                    }
                  })
                }
              })
              obj.data = obj.data.concat(messages)
            }
            return of(obj)
          })
          )
        return from(new Promise(resolve => resolve([]))).pipe(
          concat(step1, step2),
          scan((acc, curr) => Object.assign({ code: 200, messages: acc.data, hasNext: acc.hasNext }, { messages: curr.data, hasNext: curr.hasNext }), {}),
          last()
        )
      })
    )
      .subscribe(
      (array) => {
        res.send(array);
      },
      err => {
        this.fail(res, err)
      })
  }

  createUserNotify(res) {
    frontMessage.createUserNotify({ notify: this.notify, unRead: this.unRead })
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageLike(res) {
    var messagelike = {
      likes: [],
      num: { like_num: 0 }
    }
    var messageSource = from(new Promise(resolve => resolve(JSON.parse(JSON.stringify(messagelike)))))
    messageSource
      .pipe(
      concatMap(obj => {
        var step1 = defer(() => {
          return frontMessage.createLike(this.like)
        }).pipe(concatMap(result => {
          return of(obj)
        }))
        var step2 = defer(() => {
          return frontMessage.countLikes(this.message_id)
        }).pipe(
          concatMap(result => {
            obj.num.like_num = result
            return of(obj)
          }))
        var step3 = defer(() => {
          return frontMessage.updateLikeNum(this.message_id, obj.num)
        }).pipe(
          concatMap(result => {
            var { ok, n } = result.slice(-1)[0]
            if (ok && n > 0) {
              obj.result = true
            } else {
              obj.result = false
            }
            return of(obj)
          }))
        return from(frontMessage.getLike(this.user_id, this.message_id))
          .pipe(concatMap(result => {
            if (result.length > 0) {
              return of(obj)
            } else {
              return from(new Promise(resolve => resolve([]))).pipe(
                concat(step1, step2, step3),
                scan((acc, curr) => Object.assign(acc, curr), {}),
                last()
              )
            }
          }))
      }))
      .subscribe(
      (array) => {
        if (array.likes.length > 0 || array.result) {
          res.send({
            code: 201,
            message: '编辑成功'
          })
        } else {
          throw new Error('编辑失败');
        }
      },
      err => {
        this.fail(res, err)
      })
  }

  messageLikeCancel(res) {
    var num = { like_num: '' }
    var messageSource = from(new Promise(resolve => resolve(JSON.parse(JSON.stringify(num)))))
    frontMessage.getLike(this.user_id, this.message_id).then((result) => {
      if (result.length < 0) {
        res.send({
          code: 201,
          message: '编辑成功'
        })
      } else {
        frontMessage.deleteLike({ messageId: this.message_id, userId: this.user_id })
          .then((result) => {
            frontMessage.countLikes(this.message_id).then((result) => {
              num.like_num = result
              frontMessage.updateLikeNum(this.message_id, num)
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
    })
  }

  getPreview(res) {
    frontMessage.getPreview({ page: this.page, limit: this.limit })
      .then((result) => {
        var preview = result[0],
          total = result[1],
          totalPage = Math.ceil(total / this.limit),
          hasNext = totalPage > this.page ? 1 : 0
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

  getOneMessage(res) {
    var oneMessage = {
      like: null,
      data: {}
    }
    var messageSource = from(new Promise(resolve => resolve(JSON.parse(JSON.stringify(oneMessage)))))
    messageSource.pipe(concatMap(obj => {
      var step1 = from(new Promise(resolve => resolve([])))
      if (this.user_id) {
        step1 = defer(() => {
          return frontMessage.getLike(this.user_id, this._id)
        }).pipe(concatMap(result => {
          obj.like = result[0]
          return of(obj)
        }))
      }
      var step2 = defer(() => {
        return frontMessage.getMessage(this._id)
      }).pipe(concatMap(message => {
        urlAddObject(message, 'user_avatar')
        if (obj.like && obj.like.user_id == this.user_id) {
          message.like_status = true
        }
        if (message.img.length > 0) {
          if (message.message_type === "user") {
            message.img = _.map(message.img, img => {
              var arrs = img.match(/message\//g)
              if (!arrs) {
                img = `message/${message.user_id}/${this._id}/${img}`
              }
              return img = urlAddString(img)
            })
          } else {
            message.img = _.map(message.img, img => {
              var arrs = img.match(/message\//g)
              if (!arrs) {
                img = `message/${this._id}/${img}`
              }
              return img = urlAddString(img)
            })
          }
        }
        obj.data = message
        return of(obj)
      }))
      return from(new Promise(resolve => resolve([]))).pipe(
        concat(step1, step2),
        scan((acc, curr) => Object.assign({ code: 200, data: acc.data }, { data: curr.data }), {}),
        last()
      )
    }))
      .subscribe(
      result => {
        res.send(result)
      },
      err => {
        this.fail(res, err)
      })
  }

  getAllComments(res) {
    frontMessage.getCommentLike(this.user_id).then((result) => {
      var commentlikes = result
      frontMessage.getComment(this.message_id)
        .then((comments) => {
          for (var i = 0; i < comments.length; i++) {
            urlAddObject(comments[i], 'user_avatar')
            if (commentlikes && commentlikes.length > 0 && comments[i].like_num > 0) {
              for (var x = 0; x < commentlikes.length; x++) {
                if (commentlikes[x].user_id == this.user_id && `${commentlikes[x].comment_id}` === `${comments[i]._id}`) {
                  comments[i].like_status = true
                  this.getReply(comments[i], res)
                }
              }
            }
            else { this.getReply(comments[i], res) }
          }
          setTimeout(() => {
            res.send({
              code: 200,
              comments
            })
          }, 500)
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
  getReply(comment, res) {
    frontMessage.getReply(comment._id)
      .then((reply) => {
        urlAddArray(reply, ['user_avatar', 'reply_user_avatar'])
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageComment(res) {
    urlReplaceObject(this.comment, 'user_avatar')
    frontMessage.createComment(this.comment)
      .then((result) => {
        var comment = result[0]
        frontMessage.countComments(this.message_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontMessage.updateCommentNum(this.message_id, num)
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

  commentLikeCancel(res) {
    frontMessage.deleteCommentLike({ commentId: this.comment_id, userId: this.user_id })
      .then((result) => {
        frontMessage.countCommentLikes(this.comment_id).then((result) => {
          var num = Object.assign({}, { like_num: result })
          frontMessage.updateCommentLikeNum(this.comment_id, num)
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

  messageReply(res) {
    urlReplaceObject(this.reply, ['user_avatar', 'reply_user_avatar'])
    frontMessage.createReply(this.reply)
      .then((result) => {
        var reply = result[0]
        frontMessage.countComments(this.message_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontMessage.updateCommentNum(this.message_id, num)
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

  commentLikeCreate(res) {
    var num = { like_num: '' }
    frontMessage.createCommentLike(this.commentLike)
      .then((result) => {
        frontMessage.countCommentLikes(this.comment_id).then((result) => {
          num.like_num = result
          setTimeout(() => {
            frontMessage.updateCommentLikeNum(this.comment_id, num)
              .then((result) => {
                setTimeout(() => {
                  this.updateres(result, res)
                }, 100);
              })
              .catch(err => {
                this.fail(res, err)
              })
          }, 100);
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getMessagesBySearch(res) {
    frontMessage.getMessagesBySearch(this.key, this.page, this.limit)
      .then((result) => {
        var messages = result[0],
          total = result[1],
          totalPage = Math.ceil(total / this.limit),
          hasNext = totalPage > this.page ? 1 : 0;
        for (var i = 0; i < messages.length; i++) {
          urlAddObject(messages[i], 'user_avatar')
          if (messages[i].message_type === "user") {
            for (var j = 0; j < messages[i].img.length; j++) {
              var arrs = messages[i].img[j].match(/message\//g)
              if (!arrs) {
                messages[i].img[j] = `message/${messages[i].user_id}/${messages[i]._id}/${messages[i].img[j]}`
              }
              messages[i].img[j] = urlAddString(messages[i].img[j])
            }
          } else {
            for (var j = 0; j < messages[i].img.length; j++) {
              var arrs = messages[i].img[j].match(/message\//g)
              if (!arrs) {
                messages[i].img[j] = `message/${messages[i]._id}/${messages[i].img[j]}`
              }
              messages[i].img[j] = urlAddString(messages[i].img[j])
            }
          }
        }
        setTimeout(() => {
          res.send({
            code: 200,
            messages: messages,
            hasNext: hasNext
          })
        }, 100);
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  whole() {
    this.messageLike
    this.getOneMessage
    this.getAllComments
    this.messageList
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 留言列表
  messageList: connectFun('messageList', fMessage),
  // 留言创建
  userMessageCreate: connectFun('userMessageCreate', fMessage),
  // 创建用户通知
  createUserNotify: connectFun('createUserNotify', fMessage),
  // 留言赞
  messageLike: connectFun('messageLike', fMessage),
  // 留言赞取消
  messageLikeCancel: connectFun('messageLikeCancel', fMessage),
  // 获取所有部分留言预览
  getPreview: connectFun('getPreview', fMessage),
  // 留言获取一条
  getOneMessage: connectFun('getOneMessage', fMessage),
  // 获取所有评论
  getAllComments: connectFun('getAllComments', fMessage),
  // 留言评论
  messageComment: connectFun('messageComment', fMessage),
  // 留言评论赞取消
  commentLikeCancel: connectFun('commentLikeCancel', fMessage),
  // 留言评论回复
  messageReply: connectFun('messageReply', fMessage),
  // 留言评论赞
  commentLike: connectFun('commentLikeCreate', fMessage),
  // 留言根据搜索结果获取留言
  getMessagesBySearch: connectFun('getMessagesBySearch', fMessage)
}
