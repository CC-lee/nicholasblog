var FroalaEditor = require('../lib/wysiwyg-editor-node-sdk')
var FileSet = require('../image-utils').FileSet
var mkdirp = require('mkdirp')
var sharp = require('sharp')
var fse = require('fs-extra')
var fs = require('fs')
var path = require('path')
var fileFolderName = require('../../commonSet').fileFolderName
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

function Filter(file) {
  return file.match(/.jpg/g);
}

var judgeMediator = function () {
  var conflictCollect = {};
  return {
    register: function (page, kind) {
      if (!conflictCollect[page]) {
        conflictCollect[page] = {}
        conflictCollect[page][kind] = [];
      } else if (!conflictCollect[page][kind]) {
        conflictCollect[page][kind] = [];
      }
    },
    getDir: function (page, kind, dateid) {
      var folDir = require('../image-utils').FolDir(`${page}`)
    },
    addConflict: function (page, kind, dateid) {
      conflictCollect[page][kind].push(dateid)
    },
    getConflict: function (page, kind) {
      return conflictCollect[page][kind].length
    },
    clearConflict: function (page, kind) {
      if (kind == 'save') {
        kind = 'create'
      }
      setTimeout(function () {
        conflictCollect[page][kind] = []
      }, 300);
    }
  }
}()


function folderJudgeSet(page, kind) {
  var timeout = 500;
  var folDir = require('../image-utils').FolDir(`${page}`)
  judgeMediator.register(page, kind)
  var kinder;
  var kindDir
  if (kind == 'save') {
    kinder = 'create'
    kindDir = `${kinder}Dir`
  } else {
    kinder = kind
    if (kind == 'createpic' || kind == 'editpic') {
      kindDir = `${kind.replace(/pic/gim, '')}Dir`
    } else {
      kindDir = `${kind}Dir`
    }
  }
  switch (kinder) {
    case 'create':
    case 'createpic':
    case 'edit':
    case 'editpic':
      return function (req, res, next) {
        if (req.headers.dateid || req.body.dateid) {
          var dateid = req.body.dateid || req.headers.dateid
          var _id = req.body.objectId || req.headers.objectid
          judgeMediator.addConflict(page, kinder, dateid)
          var len = judgeMediator.getConflict(page, kinder)
          if (len > 1) {
            return res.send({
              code: 401,
              message: '操作冲突，请重新提交'
            });
          } else {
            var folder = folDir[kindDir](_id, dateid).folder
            if (fs.existsSync(folder)) {
              next()
            } else {
              judgeMediator.clearConflict(page, kinder)
              setTimeout(function () {
                return res.send({
                  code: 401,
                  message: '文件夹不存在，请刷新'
                });
              }, 1000);
            }
          }
        } else {
          return res.send({
            code: 401,
            message: '文件夹不存在，请刷新'
          });
        }
      }
      break;
    case 'delete':
      return function (req, res, next) {
        if (req.body.dateid) {
          var dateid = req.body.dateid
          var _id = req.body.objectId
          var createJudge = fs.existsSync(folDir.createDir(_id, dateid).folder)
          var editJudge = fs.existsSync(folDir.editDir(_id, dateid).folder)
          if (createJudge == true || editJudge == true) {
            next()
          } else {
            return res.send({
              code: 401,
              message: '文件夹不存在，请刷新'
            });
          }
        } else {
          return res.send({
            code: 401,
            message: '文件夹不存在，请刷新'
          });
        }
      }
      break;
    case 'deletAll':
      return function (req, res, next) {
        if (req.body.objectId.user_id) {
          judgeMediator.addConflict(page, kinder, req.body.objectId.user_id)
          var len = judgeMediator.getConflict(page, kinder)
          if (len > 1) {
            return res.send({
              code: 401,
              message: '操作冲突，请重新提交'
            });
          } else {
            if (fs.existsSync(path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/${req.body.objectId.user_id}/${req.body.objectId._id}`))) {
              judgeMediator.clearConflict(page, kinder)
              next()
            } else {
              return res.send({
                code: 401,
                message: '操作冲突，或该项目已被删除'
              });
            }
          }
        } else {
          if (req.body.objectId) {
            judgeMediator.addConflict(page, kinder, req.body.objectId)
            if (len > 1) {
              return res.send({
                code: 401,
                message: '操作冲突，请重新提交'
              });
            } else {
              if (fs.existsSync(folDir.editDir(req.body.objectId, req.body.dateid).depend.folder)) {
                judgeMediator.clearConflict(page, kinder)
                next()
              } else {
                return res.send({
                  code: 401,
                  message: '操作冲突，或该项目已被删除'
                });
              }
            }
          } else {
            return res.send({
              code: 401,
              message: '操作冲突，请重新编写'
            });
          }
        }
      }
      break;
  }
}


function loadImageSet(page, kind, thumbnail, info) {
  var folDir = require('../image-utils').FolDir(`${page}`)
  if (thumbnail && thumbnail.name == 'thumbnail') {
    if (info && info.name == 'info') {
      return function (req, res, next) {
        var dateid = req.body.dateid
        var _id = req.body.objectId
        if (_id) {// 编辑状态
          if (!fs.existsSync(folDir.editDir(_id, dateid).depend.folder)) {
            return res.send({
              code: 401,
              message: '文件夹不存在，请刷新'
            });
          } else {
            fse.copySync(`${fileFolderName}/${page}/${_id}`, folDir[`${kind}Dir`](_id, dateid).address)
          }
        } else {
          fse.copySync(`${fileFolderName}/${page}/save`, folDir[`${kind}Dir`](_id, dateid).address)
        }
        var files = fs.readdirSync(folDir[`${kind}Dir`](_id, dateid).address);
        files = files.filter(Filter);
        var data = []
        for (var i in files) {
          var name = files[i].replace(/.jpg/g, ``)
          data[i] = {
            filename: {
              filename: files[i],
              thumbname: `${name}m.jpg`,
              infoname: `${name}info.jpg`
            }
          }
          Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
        }
        res.send({
          data: data,
          code: 200,
          message: '上传成功'
        })
      }
    }
    return function (req, res, next) {
      var dateid = req.body.dateid
      var _id = req.body.objectId
      if (_id) {
        if (!fs.existsSync(folDir.editDir(_id, dateid).depend.folder)) {
          return res.send({
            code: 401,
            message: '文件夹不存在，请刷新'
          });
        } else {
          fse.copySync(`${fileFolderName}/${page}/${_id}`, folDir[`${kind}Dir`](_id, dateid).address)
        }
      } else {
        fse.copySync(`${fileFolderName}/${page}/save`, folDir[`${kind}Dir`](_id, dateid).address)
      }
      var files = fs.readdirSync(folDir[`${kind}Dir`](_id, dateid).address);
      files = files.filter(Filter);
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {
          filename: {
            filename: files[i],
            thumbname: `${name}m.jpg`
          }
        }
        Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
      }
      res.send({
        data: data,
        code: 200,
        message: '上传成功'
      })
    }
  } else {
    return function (req, res, next) {
      var dateid = req.body.dateid
      var _id = req.body.objectId
      if (_id) {
        if (!fs.existsSync(folDir.editDir(_id, dateid).depend.folder)) {
          return res.send({
            code: 401,
            message: '文件夹不存在，请刷新'
          });
        } else {
          fse.copySync(`${fileFolderName}/${page}/${_id}`, folDir[`${kind}Dir`](_id, dateid).address)
        }
      } else {
        fse.copySync(`${fileFolderName}/${page}/save`, folDir[`${kind}Dir`](_id, dateid).address)
      }
      var files = fs.readdirSync(folDir[`${kind}Dir`](_id, dateid).address);
      files = files.filter(Filter);
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {
          filename: files[i]
        }
        Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
      }
      res.send({
        data: data,
        code: 200,
        message: '上传成功'
      })
    }
  }
}


var loadImageSetClass = class {
  constructor(page, kind, thumbnail, info) {
    this.page = page
    this.kind = kind
    this.thumbnail = thumbnail
    this.info = info
    this.folDir = require('../image-utils').FolDir(`${this.page}`)
  }
  exe(req, res, next) {
    if (this.thumbnail && this.thumbnail.name == 'thumbnail') {
      if (this.info && this.info.name == 'info') {
        return this.thumbInfoFunc(req, res, next)
      } else {
        return this.thumbFunc(req, res, next)
      }
    } else {
      return this.normalFunc(req, res, next)
    }
  }
  thumbFunc(req, res, next) {
    var dateid = req.body.dateid
    var _id = req.body.objectId
    if (_id) {
      if (!fs.existsSync(this.folDir.editDir(_id, dateid).depend.folder)) {
        return res.send({
          code: 401,
          message: '文件夹不存在，请刷新'
        });
      } else {
        fse.copySync(`${fileFolderName}/${this.page}/${_id}`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
      }
    } else {
      fse.copySync(`${fileFolderName}/${this.page}/save`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
    }
    var files = fs.readdirSync(this.folDir[`${this.kind}Dir`](_id, dateid).address);
    files = files.filter(Filter);
    var data = []
    for (var i in files) {
      var name = files[i].replace(/.jpg/g, ``)
      data[i] = {
        filename: {
          filename: files[i],
          thumbname: `${name}m.jpg`
        }
      }
      Object.assign(data[i], FileSet(this.page, this.kind, name, this.folDir, this.thumbnail, this.info)(req, res, next))
    }
    res.send({
      data: data,
      code: 200,
      message: '上传成功'
    })
  }
  thumbInfoFunc(req, res, next) {
    var dateid = req.body.dateid
    var _id = req.body.objectId
    if (_id) {// 编辑状态
      if (!fs.existsSync(folDir.editDir(_id, dateid).depend.folder)) {
        return res.send({
          code: 401,
          message: '文件夹不存在，请刷新'
        });
      } else {
        fse.copySync(`${fileFolderName}/${this.page}/${_id}`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
      }
    } else {
      fse.copySync(`${fileFolderName}/${this.page}/save`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
    }
    var files = fs.readdirSync(this.folDir[`${this.kind}Dir`](_id, dateid).address);
    files = files.filter(Filter);
    var data = []
    for (var i in files) {
      var name = files[i].replace(/.jpg/g, ``)
      data[i] = {
        filename: {
          filename: files[i],
          thumbname: `${name}m.jpg`,
          infoname: `${name}info.jpg`
        }
      }
      Object.assign(data[i], FileSet(this.page, this.kind, name, this.folDir, this.thumbnail, this.info)(req, res, next))
    }
    res.send({
      data: data,
      code: 200,
      message: '上传成功'
    })
  }
  normalFunc(req, res, next) {
    var dateid = req.body.dateid
    var _id = req.body.objectId
    if (_id) {
      if (!fs.existsSync(this.folDir.editDir(_id, dateid).depend.folder)) {
        return res.send({
          code: 401,
          message: '文件夹不存在，请刷新'
        });
      } else {
        fse.copySync(`${fileFolderName}/${this.page}/${_id}`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
      }
    } else {
      fse.copySync(`${fileFolderName}/${this.page}/save`, this.folDir[`${this.kind}Dir`](_id, dateid).address)
    }
    var files = fs.readdirSync(this.folDir[`${this.kind}Dir`](_id, dateid).address);
    files = files.filter(Filter);
    var data = []
    for (var i in files) {
      var name = files[i].replace(/.jpg/g, ``)
      data[i] = {
        filename: files[i]
      }
      Object.assign(data[i], FileSet(this.page, this.kind, name, this.folDir, this.thumbnail, this.info)(req, res, next))
    }
    res.send({
      data: data,
      code: 200,
      message: '上传成功'
    })
  }
}



function processSet(page, kind) {
  var folDir = require('../image-utils').FolDir(`${page}`)
  var saveFolder = {
    path: function (page) {
      return `${fileFolderName}/${page}/save`
    },
    folder: function (page) {
      return path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/save`)
    }
  }
  switch (kind) {
    case 'save':
      return function (req, res, next) {
        var dateid = req.body.dateid
        var _id = req.body.objectId
        try {
          fse.removeSync(saveFolder.path(page))
          fse.copySync(folDir.createDir(_id, dateid).address, saveFolder.path(page))
          setTimeout(function () {
            fse.removeSync(`${fileFolderName}/${page}/temp`)
            fse.copySync(saveFolder.path(page), folDir.createDir(_id, dateid).address)
            judgeMediator.clearConflict(page, kind)
            next()
          }, 500);
        } catch (err) {
          if (err) {
            judgeMediator.clearConflict(page, kind)
            return res.send({
              code: 401,
              message: '后台操作错误'
            });
          }
        }
      }
      break;
    case 'create':
      return function (req, res, next) {
        var dateid = req.body.dateid
        var _id = req.body.objectId
        try {
          if (req.body.main_img) {
            var mainImg = folDir.createMainImg(_id, dateid).folder
            if (!fs.existsSync(mainImg)) {
              dir(mainImg)
            }
            fse.copySync(req.body.main_img.thumbnail, `${folDir.createMainImg(_id, dateid).address}/${req.body.main_img.thumbname}`)
          }
          fse.removeSync(`${fileFolderName}/${page}/save`)
          fse.copySync(folDir.createDir(_id, dateid).address, `${fileFolderName}/${page}/${dateid}`)
          setTimeout(function () {
            fse.removeSync(`${fileFolderName}/${page}/temp`)
            dir(path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/temp`))
            dir(saveFolder.folder(page))
            judgeMediator.clearConflict(page, kind)
            next()
          }, 500);
        } catch (err) {
          if (err) {
            judgeMediator.clearConflict(page, kind)
            return res.send({
              code: 401,
              message: '后台操作错误'
            });
          }
        }
      }
      break;
    case 'edit':
      return function (req, res, next) {
        var dateid = req.body.dateid
        var _id = req.body.objectId
        try {
          if (req.body.main_img) {
            fse.removeSync(folDir.editMainImg(_id, dateid).address)
            var mainImg = folDir.editMainImg(_id, dateid).folder
            dir(mainImg)
            fse.copySync(req.body.main_img.thumbnail, `${folDir.editMainImg(_id, dateid).address}/${req.body.main_img.thumbname}`)
          }
          fse.removeSync(`${fileFolderName}/${page}/${_id}`)
          fse.copySync(folDir.editDir(_id, dateid).address, `${fileFolderName}/${page}/${_id}`)
          setTimeout(function () {
            fse.removeSync(`${fileFolderName}/${page}/${_id}edit/edit`)
            dir(folDir.editDir(_id, dateid).parent.folder)
            judgeMediator.clearConflict(page, kind)
            next()
          }, 500);
        } catch (err) {
          if (err) {
            console.log(err);
            judgeMediator.clearConflict(page, kind)
            return res.send({
              code: 401,
              message: '后台操作错误'
            });
          }
        }
      }
      break;
  }
}

function saveImageSet(page, kind, thumbnail, info) {
  var folDir = require('../image-utils').FolDir(`${page}`)
  var image = {
    folder: function (kind, folDir, req) {
      return folDir[`${kind}Dir`](req.headers.objectid, req.headers.dateid).folder
    },
    file: function (kind, folDir, req, i) {
      return `${folDir[`${kind}Dir`](req.headers.objectid, req.headers.dateid).address}/${req.files[i].filename}`
    }
  }
  var thumbImage = {
    folder: function (kind, folDir, req) {
      return folDir[`${kind}Thumbnail`](req.headers.objectid, req.headers.dateid).folder
    },
    file: function (kind, folDir, name, req, i) {
      return `${folDir[`${kind}Thumbnail`](req.headers.objectid, req.headers.dateid).address}/${name}m.jpg`
    }
  }
  var infoImage = {
    folder: function (kind, folDir, req) {
      return folDir[`${kind}Info`](req.headers.objectid, req.headers.dateid).folder
    },
    file: function (kind, folDir, name, req, i) {
      return `${folDir[`${kind}Info`](req.headers.objectid, req.headers.dateid).address}/${name}info.jpg`
    }
  }
  if (thumbnail && thumbnail.name == 'thumbnail') {
    if (info && info.name == 'info') {
      return async function (req, res, next) {
        if (!fs.existsSync(thumbImage.folder(kind, folDir, req))) {
          dir(thumbImage.folder(kind, folDir, req))
        }
        if (!fs.existsSync(infoImage.folder(kind, folDir, req))) {
          dir(infoImage.folder(kind, folDir, req))
        }
        var data = []
        for (var i in req.files) {
          var name = req.files[i].filename.replace(/.jpg/g, ``) // .resize(300, 200) .resize(100, 100)
          await sharp(image.file(kind, folDir, req, i))
            .resize(thumbnail.width, thumbnail.height)
            .toFile(thumbImage.file(kind, folDir, name, req, i))
          await sharp(image.file(kind, folDir, req, i))
            .resize(info.width, info.height)
            .toFile(infoImage.file(kind, folDir, name, req, i))
          data[i] = {
            filename: {
              filename: req.files[i].filename,
              thumbname: `${name}m.jpg`,
              infoname: `${name}info.jpg`
            }
          }
          Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
        }
        setTimeout(function () {
          judgeMediator.clearConflict(page, `${kind}pic`)
          res.send({
            data: data,
            code: 200,
            message: '上传成功'
          })
        }, 0);
      }
    }
    return async function (req, res, next) {
      if (!fs.existsSync(thumbImage.folder(kind, folDir, req))) {
        dir(thumbImage.folder(kind, folDir, req))
      }
      var data = []
      for (var i in req.files) {
        var name = req.files[i].filename.replace(/.jpg/g, ``)
        await sharp(image.file(kind, folDir, req, i))
          .resize(thumbnail.width, thumbnail.height)
          .toFile(thumbImage.file(kind, folDir, name, req, i))
        data[i] = {
          filename: {
            filename: req.files[i].filename,
            thumbname: `${name}m.jpg`
          }
        }
        Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
      }
      setTimeout(function () {
        judgeMediator.clearConflict(page, `${kind}pic`)
        res.send({
          data: data,
          code: 200,
          message: '上传成功'
        })
      }, 0);
    }
  } else {
    return function (req, res, next) {
      var data = []
      for (var i in req.files) {
        var name = req.files[i].filename.replace(/.jpg/g, ``)
        data[i] = {
          filename: req.files[i].filename
        }
        Object.assign(data[i], FileSet(page, kind, name, folDir, thumbnail, info)(req, res, next))
      }
      setTimeout(function () {
        judgeMediator.clearConflict(page, `${kind}pic`)
        res.send({
          data: data,
          code: 200,
          message: '上传成功'
        })
      }, 0);
    }
  }
}


function deleteImageSet(page, command) {
  var folDir = require('../image-utils').FolDir(`${page}`)
  if (page === 'article' && command === 'single') {
    return function (req, res, next) {
      fs.unlinkSync(req.body.thumbnail)
      FroalaEditor.Image.delete(req.body.src, function (err) {
        if (err) {
          return res.status(404).end(JSON.stringify(err));
        }
        res.send({
          code: 200,
          message: '图片删除成功'
        })
      });
    }
  } else {
    switch (command) {
      case 'single':
        return function (req, res, next) {
          if (req.body.path) {
            fs.unlinkSync(req.body.path)
          }
          if (req.body.thumbnail) {
            fs.unlinkSync(req.body.thumbnail)
          }
          if (req.body.info) {
            fs.unlinkSync(req.body.info)
          }
          res.send({
            code: 200,
            message: '图片删除成功'
          })
        }
        break;
      case 'folder':
        return function (req, res, next) {
          if (req.body.objectId.user_id) {
            fse.removeSync(`${fileFolderName}/${page}/${req.body.objectId.user_id}/${req.body.objectId._id}`)
            next()
          } else {
            fse.removeSync(`${fileFolderName}/${page}/${req.body.objectId}`)
            if (fs.existsSync(path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/${req.body.objectId}edit`))) {
              fse.removeSync(`${fileFolderName}/${page}/${req.body.objectId}edit`)
            }
            next()
          }
        }
        break;
    }
  }
}

module.exports = {
  saveImageSet,
  deleteImageSet,
  loadImageSet,
  processSet,
  folderJudgeSet,
  loadImageSetClass
}