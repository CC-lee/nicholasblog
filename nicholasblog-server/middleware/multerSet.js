var multer = require('multer')
var fileFolderName = require('../commonSet').fileFolderName
function multerSet(page, kind) {
  switch (kind) {
    case 'create':
      var Storage = multer.diskStorage({
        destination: function (req, file, cb) {
          try {
            if (req.headers.userid) {
              cb(null, `${fileFolderName}/${page}/${req.headers['userid']}/${req.headers.dateid}`)
            } else {
              cb(null, `${fileFolderName}/${page}/temp/${req.headers.dateid}/`)
            }
          } catch (err) {
            console.log(err);
          }
        },
        filename: function (req, file, cb) {
          try {
            setTimeout(function () {
              cb(null, Date.now() + '.jpg')
            }, 100);
          } catch (err) {
            console.log(err);
          }
        }
      })
      var upload = multer({ storage: Storage })
      return upload
    case 'edit':
      var Storage = multer.diskStorage({
        destination: function (req, file, cb) {
          try {
            cb(null, `${fileFolderName}/${page}/${req.headers.objectid}edit/edit/${req.headers.dateid}/`)
          } catch (err) {
            console.log(err);
          }
        },
        filename: function (req, file, cb) {
          try {
            setTimeout(function () {
              cb(null, Date.now() + '.jpg')
            }, 100);
          } catch (err) {
            console.log(err);
          }
        }
      })
      var edit = multer({ storage: Storage })
      return edit
  }
}

module.exports = multerSet