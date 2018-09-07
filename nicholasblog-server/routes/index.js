var apiName = require('../commonSet').apiName

module.exports = function (app) {
  app.use(apiName, require('./admin'))
  app.use(apiName, require('./article'))
  app.use(apiName, require('./classify'))
  app.use(apiName, require('./album'))
  app.use(apiName, require('./message'))
  app.use(apiName, require('./shop'))
  app.use(apiName, require('./user'))
  app.use(apiName, require('./about'))
}
