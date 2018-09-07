var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var FroalaEditor = require('./lib/wysiwyg-editor-node-sdk')
var fse = require('fs-extra')
var folDir = require('./image-utils').FolDir('album')
var common = require('./image-common/image-common')
var fileFolderName = require('../commonSet').fileFolderName
// 生成文件夹
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

function frontTemp(userid, date) {
  var address = `${fileFolderName}/message/${userid}/${date}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), `${address}`)
  }
}

var createSaveImage = common.saveImageSet('message', 'create', null, null)

var createLoadImage = function () {
  var exeObj = new common.loadImageSetClass('message', 'create', null, null)
  return function (req, res, next) {
    return exeObj.exe(req, res, next)
  }
}()
//common.loadImageSet('message', 'create', null, null)

var deleteImage = common.deleteImageSet('message', 'single')

var deleteAllImage = common.deleteImageSet('message', 'folder')

var createProcess = common.processSet('message', 'create')

var createProcessJudge = common.folderJudgeSet('message', 'create')

var tempProcess = common.processSet('message', 'save')

var tempProcessJudge = common.folderJudgeSet('message', 'save')

var createFolderJudge = common.folderJudgeSet('message', 'createpic')

var deleteJudge = common.folderJudgeSet('message', 'delete')

var deleteAllJudge = common.folderJudgeSet('message', 'deletAll')


module.exports = {
  createSaveImage,
  createLoadImage,
  deleteImage,
  deleteAllImage,
  createProcess,
  createProcessJudge,
  tempProcess,
  tempProcessJudge,
  createFolderJudge,
  deleteJudge,
  deleteAllJudge,
  // 前台
  frontLoadImage(req, res, next) {

  },
  fontFolder(req, res, next) {
    var id = req.headers['userid']
    var dateid = req.headers['dateid']
    fse.ensureDirSync(frontTemp(id, dateid).address)
    next()
  },
  frontSaveImage(req, res, next) {
    let img = []
    for (var i in req.files) {
      img.push(req.files[i].filename)
    }
    var path = req.files[0].destination
    res.send({
      code: 200,
      message: '上传成功',
      data: img,
      path: path
    })
  },
  frontProcess(req, res, next) {

  }
}