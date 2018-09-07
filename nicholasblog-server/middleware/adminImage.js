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

var avatarDir = `${fileFolderName}/admin/avatar`;

var tempDir = function (dateid) {
  return `${fileFolderName}/admin/${dateid}temp`;
}

var editDir = function (dateid) {
  return `${fileFolderName}/admin/${dateid}edit`;
}

module.exports = {
  editFolder(req, res, next) {
    var dateid = req.headers.dateid;
    fse.ensureDirSync(tempDir(dateid))
    fse.ensureDirSync(editDir(dateid))
    next()
  },
  eidtLoadImage(req, res, next) {
    fse.ensureDirSync(avatarDir)
    var files = fs.readdirSync(avatarDir);
    if (files.length > 0) {
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {}
        Object.assign(data[i], {
          filename: files[i],
          url: `${urlPrefix}${avatarDir}/${files[i]}`
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
        url: `${filePrefix}admin/default/Kostya.jpg`
      })
      return res.send({
        code: 200,
        data
      });
    }
  },
  async editSaveImage(req, res, next) {
    var dateid = req.headers.dateid;
    var name = req.files[0].filename
    await sharp(`${tempDir(dateid)}/${name}`)
      .resize(300, 200)
      .toFile(`${editDir(dateid)}/${name}`)
    res.send({
      code: 200,
      message: '上传成功',
      data: {
        filename: name,
        url: `${urlPrefix}${avatarDir}/${name}`
      },
    })
  },
  editProcess(req, res, next) {
    var dateid = req.body.dateid;
    var tempJudge = fse.pathExistsSync(tempDir(dateid))
    var editJudge = fse.pathExistsSync(editDir(dateid))
    if (!tempJudge && !editJudge) {
      var arrs = req.body.avatar.match(/admin\/default/ig)
      if (arrs && arrs.length > 0) {
        fse.emptyDirSync(avatarDir)
        next()
      } else {
        next()
      }
    } else if (tempJudge && editJudge) {
      fse.removeSync(avatarDir)
      setTimeout(function () {
        fse.copySync(editDir(dateid), avatarDir)
        fse.removeSync(tempDir(dateid))
        fse.removeSync(editDir(dateid))
        next()
      }, 2000);
    }
    else {
      if (tempJudge) {
        fse.removeSync(tempDir(dateid))
      }
      if (editJudge) {
        fse.removeSync(editDir(dateid))
      }
      res.send({
        code: 401,
        message: '后台错误，请重新刷新'
      })
    }
  },
  loadAvatar(req, res, next) {
    var files = fs.readdirSync(`${fileFolderName}/admin/avatar`);
    var len = files.length
    if (len > 0) {
      var data = []
      for (var i = 0; i < len; i++) {
        var name = files[i].replace(/.jpg/g, ``)
        var imageObject = {
          filename: files[i],
          path: `${avatarDir}/${files[i]}`,
          url: `${urlPrefix}${avatarDir}/${files[i]}`
        }
        data.push(imageObject)
      }
      return res.send({
        code: 200,
        data
      });
    } else {
      var data = []
      return res.send({
        code: 200,
        data
      });
    }
  }
}