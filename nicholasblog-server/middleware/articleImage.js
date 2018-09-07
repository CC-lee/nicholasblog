var fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  FroalaEditor = require('./lib/wysiwyg-editor-node-sdk'),
  sharp = require('sharp'),
  fse = require('fs-extra'),
  common = require('./image-common/image-common'),
  httpHead = require('../commonSet').httpHead,
  hostUrl = require('../commonSet').hostUrl,
  urlPrefix = require('../commonSet').urlPrefix,
  fileFolderName = require('../commonSet').fileFolderName
// 生成文件夹
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

var saveDir = function () {
  var address = `${fileFolderName}/article/save`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var createDir = function (dateid) {
  var address = `${fileFolderName}/article/temp/${dateid}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var createThumbnail = function (dateid) {
  var address = `${fileFolderName}/article/temp/${dateid}/thumbnail`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var Dir = function (id) {
  var address = `${fileFolderName}/article/${id}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var editDir = function (id, dateid) {
  var address = `${fileFolderName}/article/${id}edit/edit/${dateid}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var editThumbnail = function (id, dateid) {
  var address = `${fileFolderName}/article/${id}edit/edit/${dateid}/thumbnail`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var tempProcess = common.processSet('article', 'save')
var tempProcessJudge = common.folderJudgeSet('article', 'save')
var createProcess = common.processSet('article', 'create')
var createProcessJudge = common.folderJudgeSet('article', 'create')
var editProcess = common.processSet('article', 'edit')
var editProcessJudge = common.folderJudgeSet('article', 'edit')
var deleteJudge = common.folderJudgeSet('article', 'delete')
var deleteAllJudge = common.folderJudgeSet('article', 'deletAll')

module.exports = {
  createSaveImage(req, res, next) {
    var dateid = req.headers['dateid'];
    var createPath = createDir(dateid).address
    var thumbPath = createThumbnail(dateid).address
    FroalaEditor.Image.upload(req, `/${createPath}/`, async function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      var regName = new RegExp(`/${createPath}/`, 'gim')
      var name = data.link.replace(/.(jpg|JPG)/g, ``).replace(regName, ``)
      await sharp(`${createPath}/${name}.jpg`)
        .resize(300, 200)
        .toFile(`${thumbPath}/${name}m.jpg`)
      data.link = `${httpHead}://${hostUrl}${data.link}`
      res.send(data);
    })
  },
  editSaveImage(req, res, next) {
    var id = req.headers['objectid'];
    var dateid = req.headers['dateid'];
    var editpath = editDir(id, dateid).address
    var thumbPath = editThumbnail(id, dateid).address
    FroalaEditor.Image.upload(req, `/${editpath}/`, async function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      var regName = new RegExp(`/${editpath}/`, 'gim')
      var name = data.link.replace(/.(jpg|JPG|png)/g, ``).replace(regName, ``)
      await sharp(`${editpath}/${name}.jpg`)
        .resize(300, 200)
        .toFile(`${thumbPath}/${name}m.jpg`)
      data.link = `${httpHead}://${hostUrl}${data.link}`
      res.send(data);
    })
  },
  createLoadImage(req, res, next) {
    var dateid = req.body['dateid'];
    if (!fs.existsSync(saveDir().folder)) {
      dir(saveDir().folder);
    }
    dir(createDir(dateid).folder);
    dir(createThumbnail(dateid).folder);
    fse.copySync(saveDir().address, createDir(dateid).address)
    return res.send({
      code: 200,
      message: '加载成功'
    });
  },
  eidtLoadImage(req, res, next) {
    var _id = req.body.objectId
    var dateid = req.body.dateid
    if (!fs.existsSync(Dir(_id).folder)) {
      dir(editDir(_id, dateid).folder);
      dir(editThumbnail(_id, dateid).folder);
    } else {
      fse.copySync(`${fileFolderName}/article/${_id}`, editDir(_id, dateid).address)
      fse.ensureDirSync(editThumbnail(_id, dateid).address)
    }
    return res.send({
      code: 200,
      message: '加载成功'
    });
  },
  eidtLoadImageProcess(req, res, next) {
    var _id = req.body.objectId
    var dateid = req.body.dateid
    fse.copySync(`${fileFolderName}/article/${_id}`, editDir(_id, dateid).address)
    next()
  },
  deleteImage(req, res, next) {
    var dateid = req.body.dateid
    if (req.body.objectId) {
      var regPath = new RegExp(`/${dateid}/`, 'gim')
      var thumbnail = req.body.src
        .replace(regPath, `/${dateid}/thumbnail/`)
        .replace(/.(jpg|JPG)/g, 'm.jpg');
    } else {
      var regPath = new RegExp(`${dateid}`, 'gim')
      var thumbnail = req.body.src
        .replace(regPath, `${dateid}/thumbnail`)
        .replace(/.(jpg|JPG)/g, 'm.jpg');
    }
    fs.unlinkSync(thumbnail)
    FroalaEditor.Image.delete(req.body.src, function (err) {
      if (err) {
        return res.status(404).end(JSON.stringify(err));
      }
      res.send({
        code: 200,
        message: '图片删除成功'
      })
    });
  },
  deleteAllImage(req, res, next) {
    var EDir = editDir(req.body.objectId)
    var path = Dir(req.body.objectId)
    if (fs.existsSync(path)) {
      fse.removeSync(`${fileFolderName}/article/${req.body.objectId}`)
      if (fs.existsSync(EDir)) {
        fse.removeSync(`${fileFolderName}/article/${req.body.objectId}edit`)
      }
    }
    next()
  },
  tempProcessJudge,
  tempProcess,
  createProcessJudge,
  createProcess,
  editProcessJudge,
  editProcess,
  deleteJudge,
  deleteAllJudge
}