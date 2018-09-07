var apimodule = require('../../dao')
var backClass = apimodule.backClass
var control = require('../control')
var frontClass = apimodule.frontClass
var commonControl = require('../common-control')
class bClass extends control {
  constructor({
    _id,
    classify,
    create_date,
    update_date,
    multiClass,
    timestamp
      }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    this.classify = {
      classify,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateClassify = {
      classify,
      update_date: this.update_date
    }
    if (multiClass) {
      for (var i = 0; i < multiClass.length; i++) {
        multiClass[i] = {
          classify: multiClass[i],
          create_date: this.create_date,
          update_date: this.update_date,
          timestamp: this.timestamp
        }
      }
      this.multiClass = multiClass
    }
    Object.assign(this, { _id })
  }

  classList(res) {
    backClass.getAllClass()
      .then((list) => {
        this.getres(list, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneClass(res) {
    backClass.getOneClass(this._id)
      .then((classify) => {
        this.getres(classify, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  async classMultiCreate(res) {
    var status = []
    for (var i = 0; i < this.multiClass.length; i++) {
      await backClass.createClass(this.multiClass[i])
        .then((result) => {
          status.push(this.multiClass[i])
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
    if (status.length == this.multiClass.length) {
      res.send({
        code: 200,
        message: '创建成功'
      })
    }
  }

  classCreate(res) {
    backClass.createClass(this.classify)
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneClass(res) {
    backClass.getOneClass(this._id)
      .then((classify) => {
        frontClass.getArticlesByClass(classify.classify)
          .then((preview) => {
            if (preview.length > 0) {
              backClass.updateClass(this._id, classify.classify, this.updateClassify)
                .then((result) => {
                  this.updateres(result, res)
                })
                .catch(err => {
                  this.fail(res, err)
                })
            } else {
              backClass.updateClassOnly(this._id, this.updateClassify)
                .then((result) => {
                  this.updateres(result, res)
                })
                .catch(err => {
                  this.fail(res, err)
                })
            }
          })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  removeClass(res) {
    backClass.removeClass(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 获取所有分类
  classList: connectFun('classList', bClass),
  // 创建分类
  classCreate: connectFun('classCreate', bClass),
  // 批量创建分类
  classMultiCreate: connectFun('classMultiCreate', bClass),
  // 获取一个分类
  getOneClass: connectFun('getOneClass', bClass),
  // 编辑分类
  editOneClass: connectFun('editOneClass', bClass),
  // 删除分类
  removeClass: connectFun('removeClass', bClass),
}
