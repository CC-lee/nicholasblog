var path = require('path'),
  config = require('../config'),
  utils = require('./utils'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  env = process.env.NODE_ENV === 'testing'
    ? require('../config/test.env')
    : config.build.env,
  extractCSS = new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash:7].css')),
  styleCSS = new ExtractTextPlugin({ filename: utils.assetsPath('css/style.[contenthash:7].css'), allChunks: true }),
  isProd = true,//process.env.NODE_ENV === 'prod', //production
  CompressionPlugin = require("compression-webpack-plugin"),
  frontSet = require('../wholeConf').front,
  srcDir = frontSet.src,
  httpHead = require('../wholeConf').httpHead,
  postcssPresetEnv =require('postcss-preset-env'),
   autoprefixer = require('autoprefixer'),
   browserslist = require('browserslist')


var vendor = [ //'element-ui',
  'vue',
  'vuex',
  'vue-router'
]
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: styleCSS.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader',
            }),
            scss: styleCSS.extract({
              use: 'css-loader!sass-loader',
              fallback: 'vue-style-loader',
            }),
            sass: styleCSS.extract({
              use: 'css-loader!sass-loader?indentedSyntax',
              fallback: 'vue-style-loader',
            }),
            postcss: {
              options: {
                ident: 'postcss',
                plugins: () => [
                  autoprefixer({ browsers: browserslist('last 2 version, > 0.1%') })//postcssPresetEnv()
                ]
              }
            }
          }
        }
      }, {
        test: /\.css$/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader'])
      }, {
        test: /\.less/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader', 'less-loader'])
      }, {
        test: /\.s[a|c]ss/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader', 'sass-loader'])
      }]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  entry: {
    app: `./${srcDir}/main.js`,
    vendor: vendor,
    polyfills:`./${srcDir}/polyfills.js`
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.build.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js',
      'vuex': 'vuex/dist/vuex.min.js',
      'src': path.resolve(__dirname, `../${srcDir}`),
      'assets': path.resolve(__dirname, `../${srcDir}/assets`),
      'pages': path.resolve(__dirname, `../${srcDir}/pages`),
      'public': path.resolve(__dirname, `../${srcDir}/pages/components`),
      'api': path.resolve(__dirname, `../${srcDir}/api/index.js`),
      'execlib': path.resolve(__dirname, `../${srcDir}/lib/execlib.js`),
      'store': path.resolve(__dirname, `../${srcDir}/store`)
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`  //'"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    }),
    extractCSS,
    styleCSS,
    new CompressionPlugin({
      'test': /\.js$|\.css$/,
      'asset': '[path].gz[query]',
      'algorithm': 'gzip',
      'minRatio': 0.8
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['manifest', 'vendor'],
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      chunks: [
        'manifest', 'polyfills','vendor','app'
      ],
      filename: function () {
        if (frontSet.middle) {
          return `${frontSet.middle}-index.html`
        } else {
          return `index.html`
        }
      }(),
      template: `${srcDir}/template/index.html`,
      inject: true,
      chunksSortMode: "dependency",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProd,
      options: {
        context: __dirname
      }
    })
  ]
})

module.exports = webpackConfig
