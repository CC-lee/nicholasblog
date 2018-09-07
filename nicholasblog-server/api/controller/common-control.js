var commonSet = require('../../commonSet')
serverSet = commonSet.serverSet,
  _ = require('lodash'),
  { Subject } = require('rxjs/Subject'),
  { of } = require('rxjs/observable/of'),
  { BehaviorSubject } = require('rxjs/BehaviorSubject'),
  {
    concatMap, mergeMap, pluck, flatMap, last, map, find, filter,
    partition, concat, toArray, tap, scan, isEmpty, zip, combineLatest,
    shareReplay, refCount, publishReplay
  } = require('rxjs/operators')
var { Subject } = require('rxjs'),
  ProxyListener = require('proxylistenerjs/proxylistener.node.min')
/**
 bind 函数
 function bind(fn, context) {
  // 闭包返回新函数
  return function () {
    // 对fn 装饰并返回
    return fn.apply(context, arguments);
  }
}
 */

var pListener = new ProxyListener(Subject)
var proxyListen = pListener.proxyListen

function bindFun(that, fn) {
  return function () {
    return fn.apply(that, arguments)
  }
}

function connectFun(Command, Connect) {
  return async (req, res) => {
    var connect = new Connect(req.body)
    await connect[Command](res)
    connect = null
  }
}

function urlReplaceProcess(para, hostPrefix, re) {
  if (Array.isArray(para)) {
    var len = para.length
    for (var i = 0; i < len; i++) {
      para[i] = para[i].replace(re, '')
    }
  } else {
    if (para) {
      para = para.replace(re, '')
    }
  }
  return para
}


function urlAddProcess(para, hostPrefix, re) {
  if (Array.isArray(para)) {
    var len = para.length
    for (var i = 0; i < len; i++) {
      para[i] = para[i].replace(re, '')
      para[i] = hostPrefix + para[i]
    }
  } else {
    if (para) {
      para = para.replace(re, '')
      para = hostPrefix + para
    }
  }
  return para
}


function urlReplaceSet(command) {
  var host = serverSet.hostFile,
    file = serverSet.file,
    re = new RegExp(`${commonSet.httpHead}://${host}/${file}/|/${file}/|${file}/`, 'gim'),
    hostPrefix = `${commonSet.httpHead}://${host}/${file}/`
  switch (command) {
    case 'object':
      return function (para, property) {
        if (Array.isArray(property)) {
          for (var i = 0; i < property.length; i++) {
            para[property[i]] = urlReplaceProcess(para[property[i]], hostPrefix, re)
          }
        } else {
          para[property] = urlReplaceProcess(para[property], hostPrefix, re)
        }
        return para
      }
      break;
    case 'string':
      return function (para) {
        if (para) {
          para = para.replace(re, '')
        }
        return para
      }
  }
}

function urlAddSet(command) {
  var host = serverSet.hostFile,
    file = serverSet.file,
    hostPrefix = `${commonSet.httpHead}://${host}/${file}/`,
    re = new RegExp(`${hostPrefix}|/${file}/|${file}/`, 'gim')
  switch (command) {
    case 'object':
      return function (para, property) {
        if (_.isArray(property)) {
          _.map(property, props => {
            para[props] = urlAddProcess(para[props], hostPrefix, re)
          })
        } else {
          para[property] = urlAddProcess(para[property], hostPrefix, re);
        }
        //Array.isArray(property)
        /**if (_.isArray(property)) {
          for (var i = 0; i < property.length; i++) {
            para[property[i]] = urlAddProcess(para[property[i]], hostPrefix, re)
          }
        } else {
          para[property] = urlAddProcess(para[property], hostPrefix, re);
        }**/
      }
      break;
    case 'array':
      return function (para, property) {
        _.map(para, pa => {
          if (_.isArray(property)) {
            _.map(property, props => {
              pa[props] = urlAddProcess(pa[props], hostPrefix, re)
            })
          } else {
            pa[property] = urlAddProcess(pa[property], hostPrefix, re)
          }
        })
        /**for (var i = 0; i < para.length; i++) {
          if (_.isArray(property)) {
            for (var j = 0; j < property.length; j++) {
              para[i][property[j]] = urlAddProcess(para[i][property[j]], hostPrefix, re)
            }
          } else {
            para[i][property] = urlAddProcess(para[i][property], hostPrefix, re)
          }
        }**/
        return para
      }
      break;
    case 'string':
      return function (para) {
        if (para) {
          para = para.replace(re, '')
          para = hostPrefix + para
        }
        return para
      }
  }
}






module.exports = {
  commonSet,
  connectFun,
  bindFun,
  urlReplaceSet,
  urlAddSet,
  proxyListen
}