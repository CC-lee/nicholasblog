var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fse = require('fs-extra')
sharp.cache(false);
var filePrefix = require('../commonSet').filePrefix
var hostUrl = require('../commonSet').hostUrl
var fileFolderName = require('../commonSet').fileFolderName
var urlPrefix = require('../commonSet').urlPrefix
// 生成文件夹
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

var dirFun = function (id, dateid) {
  return {
    avatar: `${fileFolderName}/user/${id}/avatar`,
    temp: `${fileFolderName}/user/${id}/${dateid}temp`,
    edit: `${fileFolderName}/user/${id}/${dateid}edit`
  }
}

module.exports = {
  // 前台
  editFolder(req, res, next) {
    var dateid = req.headers.dateid;
    var id = req.headers.id
    var userFolder = dirFun(id, dateid)
    fse.ensureDirSync(userFolder.temp)
    fse.ensureDirSync(userFolder.edit)
    next()
  },
  async editSaveImage(req, res, next) {
    var dateid = req.headers.dateid;
    var id = req.headers.id
    var userFolder = dirFun(id, dateid)
    var name = req.files[0].filename
    await sharp(`${userFolder.temp}/${name}`)
      .resize(300, 200)
      .toFile(`${userFolder.edit}/${name}`)
    res.send({
      code: 200,
      message: '上传成功',
      data: {
        filename: name,
        url: `${urlPrefix}${userFolder.avatar}/${name}`,
      }
    })
  },
  eidtLoadImage(req, res, next) {
    var dateid = req.body.dateid;
    var id = req.body.id
    var userFolder = dirFun(id, dateid)
    fse.ensureDirSync(userFolder.avatar)
    var files = fs.readdirSync(userFolder.avatar);
    if (files.length > 0) {
      var data = []
      for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {}
        Object.assign(data[i], {
          filename: files[i],
          url: `${urlPrefix}${userFolder.avatar}/${files[i]}`
        })
      }
      return res.send({
        code: 200,
        data
      });
    } else {
      var data = []
      data[0] = {}
      Object.assign(data[0], {
        filename: 'Kostya.jpg',
        url: `${filePrefix}user/default/Kostya.jpg`
      })
      return res.send({
        code: 200,
        data
      });
    }
  },
  editProcess(req, res, next) {
    var dateid = req.body.dateid;
    var id = req.body._id
    var userFolder = dirFun(id, dateid)
    var tempJudge = fse.pathExistsSync(userFolder.temp)
    var editJudge = fse.pathExistsSync(userFolder.edit)
    if (!tempJudge && !editJudge) {
      var arrs = req.body.user_avatar.match(/user\/default/ig)
      if (arrs && arrs.length > 0) {
        fse.emptyDirSync(userFolder.avatar)
        next()
      } else {
        next()
      }
    } else if (tempJudge && editJudge) {
      fse.removeSync(userFolder.avatar)
      setTimeout(function () {
        fse.copySync(userFolder.edit, userFolder.avatar)
        fse.removeSync(userFolder.temp)
        fse.removeSync(userFolder.edit)
        next()
      }, 1000);
    } else {
      if (tempJudge) {
        fse.removeSync(userFolder.temp)
      }
      if (editJudge) {
        fse.removeSync(userFolder.edit)
      }
      res.send({
        code: 401,
        message: '后台错误，请重新刷新'
      })
    }
  },
  deleteImage(req, res, next) {
    fs.unlinkSync(req.body.path)
    res.send({
      code: 200,
      message: '删除成功'
    })
  }
}