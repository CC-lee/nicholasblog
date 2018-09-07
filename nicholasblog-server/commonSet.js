var wholeConf = require('../wholeConf')(process.env.NODE_ENV)
var frontSet = wholeConf.front,
  serverCollect = wholeConf.serverCollect,
  serverSet = serverCollect.setnone,
  httpHead = wholeConf.httpHead,
  apiName = `/${serverSet.api}`,
  hostName = serverSet.hostName,
  portName = serverSet.port,
  hostUrl = serverSet.hostFile,
  filePrefix = `${httpHead}://${hostUrl}/${serverSet.file}/`,
  urlPrefix = `${httpHead}://${hostUrl}/`,
  fileFolderName = serverSet.file,
  frontUrl = frontSet.host
module.exports = {
  httpHead,
  apiName,
  hostName,
  portName,
  filePrefix,
  hostUrl,
  fileFolderName,
  frontUrl,
  serverSet,
  urlPrefix
}