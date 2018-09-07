var apimodule = require('../../dao'),
  backArticle = apimodule.backArticle,
  control = require('../control'),
  jetpack = require('fs-jetpack'),
  commonControl = require('../common-control'),
  hostUrl = commonControl.commonSet.hostUrl,
  fileFolderName = commonControl.commonSet.fileFolderName,
  filePrefix = commonControl.commonSet.filePrefix,
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string'))
class bArticle extends control {
  constructor({
    dateid,
    _id,
    title,
    content,
    classify,
    comment_num,
    like_num,
    like_status,
    article_id,
    comment_id,
    article_preview,
    theme_img,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, article_id, title, theme_img, comment_id, dateid })
    this.temp = {
      title,
      content,
      classify,
    }
    this.article = {
      title,
      content,
      comment_num,
      like_num,
      like_status,
      classify,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      article_id,
      title,
      article_preview,
      theme_img,
      classify,
      like_num,
      like_status,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      title,
      article_id,
      classify,
      like_num,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateArticle = {
      title,
      content,
      classify,
      update_date: this.update_date
    }
    this.updatePreview = {
      title,
      article_preview,
      theme_img,
      classify,
      update_date: this.update_date
    }
    this.updateInfo = {
      title,
      classify,
      update_date: this.update_date
    }

  }

  getArticleTemp(res) {
    var dateidReg = new RegExp('/dateid/', 'gim')
    var prefixReg = new RegExp(`article/temp/`, 'gim')
    backArticle.getTemp()
      .then((temp) => {
        if (temp[0].content) {
          temp[0].content = temp[0].content
            .replace(dateidReg, `/${this.dateid}/`)
            .replace(prefixReg, `${filePrefix}article/temp/`)
        }
        this.getres(temp, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleTemp(res) {
    var dateidReg = new RegExp(`/${this.dateid}/`, 'gim')
    var fileReg = new RegExp(filePrefix, 'gim')
    if (this.temp.content) {
      this.temp.content = this.temp.content
        .replace(dateidReg, '/dateid/')
        .replace(fileReg, '')
    }
    backArticle.updateTemp({ tempId: this._id, temp: this.temp })
      .then((result) => {
        res.send({
          code: 200,
          message: '保存成功'
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleCreate(res) {
    var reg = new RegExp(`/temp/${this.dateid}/`, 'gim')
    var fileReg = new RegExp(filePrefix, 'gim')
    if (this.article.content) {
      this.article.content = this.article.content
        .replace(reg, `/articleId/`)
        .replace(fileReg, '')
    }
    Object.assign(this.temp, { title: '', content: '', classify: '' })
    backArticle.createArticle(this.article, { tempId: this._id, temp: this.temp })
      .then((result) => {
        var { _id: articleId } = result[0]
        jetpack.rename(`${fileFolderName}/article/${this.dateid}`, `${articleId}`);
        if (this.theme_img) {
          urlReplaceString(this.theme_img)
          Object.assign(this.preview, {
            article_id: `${articleId}`, theme_img: this.theme_img
              .replace(reg, `/${articleId}/thumbnail/`)
              .replace(/\.(jpg|pdf|JPG|png)/ig, 'm.jpg')
              .replace(fileReg, '')
          })
        }
        Object.assign(this.info, { article_id: `${articleId}` })
        backArticle.createArticlePvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            this.createres(result, res)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
  }

  articleInfo(res) {
    backArticle.getInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articledelete(res) {
    backArticle.deleteArticle(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneArticle(res) {
    var reg = new RegExp(`/articleId/`, 'gim')
    var fileReg = RegExp(`${filePrefix}`, 'gim')
    var prefixReg = RegExp(`article/${this._id}edit/`, 'gim')
    var prefix = `${filePrefix}article/${this._id}edit/`
    backArticle.getArticle(this._id)
      .then((article) => {
        if (article.content) {
          article.content = article.content
            .replace(reg, `/${this._id}edit/edit/${this.dateid}/`)
            .replace(fileReg, '')
            .replace(prefixReg, prefix)
        }
        this.getres(article, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneArticle(res) {
    var reg = new RegExp(`/${this._id}edit/edit/${this.dateid}/`, 'gim')
    var fileReg = new RegExp(filePrefix, 'gim')
    if (this.updateArticle.content) {
      this.updateArticle.content = this.updateArticle.content
        .replace(reg, `/articleId/`)
        .replace(fileReg, '')
      urlReplaceString(this.updateArticle.content)
    }
    if (this.updatePreview.theme_img) {
      this.updatePreview.theme_img = this.updatePreview.theme_img
        .replace(reg, `/${this._id}/thumbnail/`)
        .replace(/\.(jpg|pdf|JPG|png)/ig, 'm.jpg')
        .replace(fileReg, '')
    }
    backArticle.updateArticle(this._id, { article: this.updateArticle, preview: this.updatePreview, info: this.updateInfo })
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneComment(res) {
    backArticle.deleteComment(this.comment_id)
      .then((result) => {
        backArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          backArticle.updateCommentNum(this.article_id, num)
            .then((result) => {
              this.deleteres(result, res)
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

  getAllComments(res) {
    backArticle.getComment(this.article_id)
      .then(async (comments) => {
        for (var i = 0; i < comments.length; i++) {
          urlAddObject(comments[i], 'user_avatar')
          await this.getReply(comments[i], res)
        }
        res.send({
          code: 200,
          comments
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
  // getAllComments的内嵌函数
  async getReply(comment, res) {
    await backArticle.getReply(comment._id)
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
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 获取草稿数据
  getArticleTemp: connectFun('getArticleTemp', bArticle),
  // 更新草稿数据
  articleTemp: connectFun('articleTemp', bArticle),
  // 创建文章
  articleCreate: connectFun('articleCreate', bArticle),
  //获取文章信息列表
  articleInfo: connectFun('articleInfo', bArticle),
  // 文章删除
  articledelete: connectFun('articledelete', bArticle),
  // 获取一篇文章
  getOneArticle: connectFun('getOneArticle', bArticle),
  // 更新文章
  editOneArticle: connectFun('editOneArticle', bArticle),
  // 编辑临时更新
  editOneTemp: connectFun('editOneTemp', bArticle),
  // 删除一条评论
  deleteOneComment: connectFun('deleteOneComment', bArticle),
  // 获取一篇文章的所有评论
  getAllComments: connectFun('getAllComments', bArticle)
}
