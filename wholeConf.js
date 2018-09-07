var setNone = require('./wholeConf/setNone')


var wholeSet = function (status) {
  var setnone = function () {
    if (status === 'dev') {
      return setNone.dev()
    }
    if (status === 'prod') {
      return setNone.prod()
    }
    if (status === 'deploy') {
      return setNone.deploy()
    }
  }()

  var setUp = [{ from: 'index', to: '/index.html' }, { from: /\/back/, to: '/back-index.html' }]

  var serverCollect = {
    setnone: function () {
      if (status === 'dev') {
        return setNone.dev().server
      }
      if (status === 'prod') {
        return setNone.prod().server
      }
      if (status === 'deploy') {
        return setNone.deploy().server
      }
    }()
  }

  var httpHead = 'http'

  var { front, back, server } = setnone
  var ret = {
    status,
    front,
    back,
    server,
    setUp,
    serverCollect,
    httpHead
  }
  return ret
}

module.exports = wholeSet 