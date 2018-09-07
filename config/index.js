// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path'),
  wholeset = require('../wholeConf')(process.env.NODE_ENV), //process.env.NODE_ENV
  frontSet = wholeset.front,
  serverSet = wholeset.server,
  serverCollect = wholeset.serverCollect,
  setnoneSet = serverCollect.setnone
module.exports = {
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: frontSet.pathName,
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    proxyTable: {
      [`/${setnoneSet.api}`]: {
        target: `http://${setnoneSet.host}/${setnoneSet.api}`,
        changeOrigin: true,
        pathRewrite: {
          [`^/${setnoneSet.api}`]: ''
        }
      }
    }
  },
  dev: {
    port: frontSet.port,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      [`/${serverSet.api}`]: {
        target: `http://${serverSet.host}/${serverSet.api}`,
        changeOrigin: true,
        pathRewrite: {
          [`^/${serverSet.api}`]: ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}