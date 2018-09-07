import api from "api";
import * as wholeSet from '../../wholeConf'
import { Subject, Subscriber } from 'rxjs'
import { of } from 'rxjs/observable/of'
import { concatMap } from 'rxjs/operators'
import ProxyListener from 'proxylistenerjs/proxylistener.min'



var frontSet = wholeSet.front,
  backSet = wholeSet.back,
  serverSet = wholeSet.server,
  httpHead = wholeSet.httpHead

var set = {
  frontHost: frontSet.host,
  serverHost: serverSet.host,
  hostFile: serverSet.hostFile,
  backMiddle: frontSet.backMiddle,
  frontMiddle: frontSet.middle,
  api: serverSet.api,
  token: frontSet.token,
  file: serverSet.file
}

function setting(setObject) {
  var urlMiddlePrefix;
  var { frontHost, serverHost, file, hostFile, frontMiddle, backMiddle, api, token } = setObject
  if (backMiddle && backMiddle !== 'back') {
    urlMiddlePrefix = `/${backMiddle}/`
    frontMiddle = `/${frontMiddle}`
  } else {
    urlMiddlePrefix = '/back/'
    frontMiddle = ''
    token = ''
    api = 'api'
  }
  return {
    apiName: `${api}`,
    tokenName: `${token}userjwt`,
    filePrefix: `${httpHead}://${hostFile}/${file}/`,
    host: `${httpHead}://${frontHost}/`,
    hostFrontMainPath: `${httpHead}://${frontHost}${frontMiddle}`,
    hostBackMainPath: `${httpHead}://${frontHost}${urlMiddlePrefix}pages`
  }
}

var baseSet = setting(set)

var {
  apiName,
  host,
  hostFrontMainPath,
  hostBackMainPath,
  filePrefix,
  tokenName
} = baseSet


var execlib = function () {


  var pListener = new ProxyListener(Subject)
  var proxyListen = pListener.proxyListen
  var proxyListenGroup = pListener.proxyListenGroup

  function getexec() {

  }

  function uploadexec() {

  }


  return {
    getexec,
    uploadexec,
    tokenName,
    apiName,
    filePrefix,
    host,
    hostFrontMainPath,
    hostBackMainPath,
    proxyListen,
    proxyListenGroup
  }
}()

export default execlib