var path = require('path')
var urlPrefix = require('../commonSet').urlPrefix
var fileFolderName = require('../commonSet').fileFolderName
function DirSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/temp/${dateid}`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`)
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/${id}edit/edit/${dateid}`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
          parent: {
            path: `${fileFolderName}/${page}/${id}edit/edit`,
            folder: path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/${id}edit/edit`)
          },
          depend: {
            path: `${fileFolderName}/${page}/${id}`,
            folder: path.join(path.dirname(require.main.filename), `${fileFolderName}/${page}/${id}`)
          }
        }
      }
      break;
  }
}

function ThumbnailSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/temp/${dateid}/thumbnail`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`)
        };
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/${id}edit/edit/${dateid}/thumbnail`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function InfoSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/temp/${dateid}/imageInfo`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/${id}edit/edit/${dateid}/imageInfo`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function MainImg(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/temp/${dateid}/mainImg`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `${fileFolderName}/${page}/${id}edit/edit/${dateid}/mainImg`
        return {
          url: `${urlPrefix}${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function FolDir(page) {
  return {
    createDir: DirSet(page, 'create'),
    createThumbnail: ThumbnailSet(page, 'create'),
    createInfo: InfoSet(page, 'create'),
    createMainImg: MainImg(page, 'create'),
    editDir: DirSet(page, 'edit'),
    editThumbnail: ThumbnailSet(page, 'edit'),
    editInfo: InfoSet(page, 'edit'),
    editMainImg: MainImg(page, 'edit')
  }
}



function ReadFolder() {

}


function FileSet(page, kind, name, folDir, thumbnail, info) {
  var imageSet = function (folDir, kind, _id, dateid, name) {
    return {
      image: {
        path: `${folDir[`${kind}Dir`](_id, dateid).address}/${name}.jpg`,
        url: `${folDir[`${kind}Dir`](_id, dateid).url}/${name}.jpg`
      },
      thumbImage: {
        path: `${folDir[`${kind}Thumbnail`](_id, dateid).address}/${name}m.jpg`,
        url: `${folDir[`${kind}Thumbnail`](_id, dateid).url}/${name}m.jpg`
      },
      infoImage: {
        path: `${folDir[`${kind}Info`](_id, dateid).address}/${name}info.jpg`,
        url: `${folDir[`${kind}Info`](_id, dateid).url}/${name}info.jpg`
      }
    }
  }
  if (thumbnail && thumbnail.name == 'thumbnail') {
    if (info && info.name == 'info') {
      return function (req, res, next) {
        var dateid = req.headers.dateid || req.body.dateid
        var _id = req.headers.objectid || req.body.objectId
        var imageFun = imageSet(folDir, kind, _id, dateid, name)
        return {
          path: {
            path: imageFun.image.path,
            thumbnail: imageFun.thumbImage.path,
            info: imageFun.infoImage.path
          },
          url: {
            url: imageFun.image.url,
            preview: imageFun.thumbImage.url,
            info: imageFun.infoImage.url
          }
        }
      }
    }
    return function (req, res, next) {
      var dateid = req.headers.dateid || req.body.dateid
      var _id = req.headers.objectid || req.body.objectId
      var imageFun = imageSet(folDir, kind, _id, dateid, name)
      return {
        path: {
          path: imageFun.image.path,
          thumbnail: imageFun.thumbImage.path
        },
        url: {
          url: imageFun.image.url,
          preview: imageFun.thumbImage.url
        }
      }
    }
  } else {
    return function (req, res, next) {
      var dateid = req.headers.dateid || req.body.dateid
      var _id = req.headers.objectid || req.body.objectId
      var imageFun = imageSet(folDir, kind, _id, dateid, name)
      return {
        path: imageFun.image.path,
        url: imageFun.image.url
      }
    }
  }
}


module.exports = {
  FolDir,
  FileSet
}