if (process.env.NODE_ENV) {
  if (process.env.NODE_ENV === 'prod') {
    var wholeConf = require('../wholeConf')('prod')
  } 
  else if (process.env.NODE_ENV === 'deploy') {
    var wholeConf = require('../wholeConf')('deploy')
  }
}
else {
  var wholeConf = require('../wholeConf')('dev')
}


module.exports = wholeConf 