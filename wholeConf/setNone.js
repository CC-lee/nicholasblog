var dev = function () {
  var frontMiddleAsset = '',
    backMiddleAsset = '',
    backMiddle = 'back',
    siteHostName = '192.168.16.108:8088',
    serverHostName = '192.168.16.108',
    serverPort = 3009
  return {
    front: {
      host: siteHostName,
      middle: '',
      middleAsset: frontMiddleAsset,
      token: '',
      pathName: `static${frontMiddleAsset}`,
      src: 'src',
      port: 8088,
      backMiddle: backMiddle
    },
    back: {
      middle: backMiddle,
      middleAsset: backMiddleAsset,
      token: '',
      src: 'src',
      pathName: `adminstatic${backMiddleAsset}`
    },
    server: {
      hostFile: `${serverHostName}:${serverPort}`,
      host: `${serverHostName}:${serverPort}`,
      file: 'uploads',
      api: 'api',
      port: serverPort,
      hostName: serverHostName
    }
  }
}
var prod = function () {
  var frontMiddleAsset = '',
    backMiddleAsset = 'Back',
    backMiddle = 'back',
    siteHostName = '192.168.16.108:8088',
    serverHostName = '192.168.16.108',
    serverPort = 3009
  return {
    front: {
      host: siteHostName,
      middle: '',
      middleAsset: frontMiddleAsset,
      token: '',
      pathName: `static${frontMiddleAsset}`,
      src: 'src',
      port: 8088,
      backMiddle: backMiddle
    },
    back: {
      middle: backMiddle,
      middleAsset: backMiddleAsset,
      token: '',
      src: 'src',
      pathName: `adminstatic${backMiddleAsset}`
    },
    server: {
      hostFile: `${serverHostName}:${serverPort}`,
      host: `${serverHostName}:${serverPort}`,
      file: 'uploads',
      api: 'api',
      port: serverPort,
      hostName: serverHostName
    }
  }
}
var deploy = function () {
  var frontMiddleAsset = '',
    backMiddleAsset = 'Back',
    backMiddle = 'back',
    siteHostName = 'www.nicholasblog.site',
    serverHostName = 'localhost',
    serverPort = 3009
  return {
    front: {
      host: siteHostName,
      middle: '',
      middleAsset: frontMiddleAsset,
      token: '',
      pathName: `static${frontMiddleAsset}`,
      src: 'src',
      port: 8088,
      backMiddle: 'adminback'
    },
    back: {
      middle: backMiddle,
      middleAsset: backMiddleAsset,
      token: '',
      src: 'src',
      pathName: `adminstatic${backMiddleAsset}`
    },
    server: {
      hostFile: siteHostName,
      host: `${serverHostName}:${serverPort}`,
      file: 'uploads',
      api: 'api',
      port: serverPort,
      hostName: serverHostName
    }
  }
}

module.exports = {
  dev,
  prod,
  deploy
}