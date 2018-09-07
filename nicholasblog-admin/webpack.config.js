const fs = require('fs');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { LoaderOptionsPlugin } = require('webpack');
const { DefinePlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack');
const sass = require("node-sass");
const sassUtils = require("node-sass-utils")(sass);
const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), `${srcDir}`, '$$_gendir', 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "scripts", "styles", "vendor", "main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";
const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        }
        else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
        else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

var wholeSet = require('./wholeConfAdmin')
var backSet = wholeSet.back
var srcDir = backSet.src

var pathName = backSet.pathName
var assetsName = `assets${backSet.middleAsset}`

console.log(process.env.NODE_ENV);
module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "alias": {
      'app': path.resolve(__dirname, `./${srcDir}/app`),
      'execlib': path.resolve(__dirname, `./${srcDir}/app/lib/execlib.js`)
    },
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true
  },
  "resolveLoader": {
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      `./${srcDir}\\main.ts`
    ],
    "polyfills": [
      `./${srcDir}\\polyfills.ts`
    ],
    "scripts": [
      "script-loader!./node_modules\\jquery\\dist\\jquery.js",
      "script-loader!./node_modules\\jquery-slimscroll\\jquery.slimscroll.js",
      "script-loader!./node_modules\\tether\\dist\\js\\tether.js",
      "script-loader!./node_modules\\bootstrap\\dist\\js\\bootstrap.js",
      "script-loader!./node_modules\\chroma-js\\chroma.js",
      "script-loader!./node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\js\\froala_editor.pkgd.min.js",
      "script-loader!./node_modules\\at.js\\dist\\js\\jquery.atwho.min.js"
    ],
    "styles": [
      "./node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss",
      "./node_modules\\normalize.css\\normalize.css",
      "./node_modules\\font-awesome\\css\\font-awesome.css",
      "./node_modules\\font-awesome\\scss\\font-awesome.scss",
      "./node_modules\\ionicons\\scss\\ionicons.scss",
      "./node_modules\\bootstrap\\scss\\bootstrap.scss",
      "./node_modules\\ng2-slim-loading-bar\\style.css",
      `./${srcDir}\\app\\theme\\theme.scss`,
      `./${srcDir}\\styles.css`,
      "./node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css",
      "./editor.style.css",
      "./node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css",
      "./node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css",
      "./node_modules\\at.js\\dist\\css\\jquery.atwho.min.css"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "publicPath": '/',
    "filename": path.posix.join(pathName, 'js/[name].[chunkhash:7].bundle.js'),
    "chunkFilename": path.posix.join(pathName, 'js/[id].[chunkhash:7].chunk.js')
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "use": [{
          loader: 'babel-loader',
          options: {
            presets: ["es2015", "env"]
          }
        }, {
          loader: "source-map-loader"
        }],
        "exclude": [
          /(\\|\/)node_modules(\\|\/)/
        ]
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg|cur)$/,
        "loader": `file-loader?name=${pathName}/img/[name].[hash:20].[ext]`
      },
      {
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        "loader": `url-loader?name=${pathName}/fonts/[name].[hash:20].[ext]&limit=10000`
      },
      {
        "exclude": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.less$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.styl$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.css$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": [],
              "functions": {
                "get($keys)": function (keys) {
                  var arg = 'Spark'
                  arg = sassUtils.castToSass(arg)
                  return arg
                },
                "status()": function () {
                  var arg = wholeSet.status
                  arg = sassUtils.castToSass(arg)
                  return arg
                },
                "setAsset()": function () {
                  var arg = backSet.middleAsset
                  arg = sassUtils.castToSass(arg)
                  return arg
                }
              }
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.less$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "node_modules\\roboto-fontface\\css\\roboto\\sass\\roboto-fontface.scss"),
          path.join(process.cwd(), "node_modules\\normalize.css\\normalize.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\scss\\font-awesome.scss"),
          path.join(process.cwd(), "node_modules\\ionicons\\scss\\ionicons.scss"),
          path.join(process.cwd(), "node_modules\\bootstrap\\scss\\bootstrap.scss"),
          path.join(process.cwd(), "node_modules\\ng2-slim-loading-bar\\style.css"),
          path.join(process.cwd(), `${srcDir}\\app\\theme\\theme.scss`),
          path.join(process.cwd(), `${srcDir}\\styles.css`),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_editor.pkgd.min.css"),
          path.join(process.cwd(), "editor.style.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\themes\\gray.css"),
          path.join(process.cwd(), "node_modules\\angular-froala-wysiwyg\\node_modules\\froala-editor\\css\\froala_style.min.css"),
          path.join(process.cwd(), "node_modules\\at.js\\dist\\css\\jquery.atwho.min.css")
        ],
        "test": /\.styl$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`  //'"production"'
      }
    }),
    new ExtractTextPlugin({ filename: 'css/[name].[hash].css' }),
    new CopyWebpackPlugin(
      [{
        context: path.resolve(__dirname, `./${srcDir}`),
        from: 'assets',
        to: `${assetsName}`
      },
      {
        context: path.resolve(__dirname, `./${srcDir}`),
        from: 'favicon.ico',
        to: ''
      }]
    ),
    new CompressionPlugin({
      'test': /\.js/,
      'asset': '[path].gz[query]',
      'algorithm': 'gzip',
      'minRatio': 0.8
    }),
    new UglifyJsPlugin({
      "uglifyOptions": {
        "output": {
          "comments": false,
        },
        "compress": {
          "warnings": false
        }
      }
    }),
    new NoEmitOnErrorsPlugin(),
    new ProgressPlugin(),
    new CircularDependencyPlugin({
      "exclude": /(\\|\/)node_modules(\\|\/)/,
      "failOnError": false
    }),
    new NamedLazyChunksWebpackPlugin(),
    new HtmlWebpackPlugin({
      "template": `./${srcDir}\\index.html`,
      "filename": function () {
        if (backSet.middle) {
          return `./${backSet.middle}-index.html`
        } else {
          return './index.html'
        }
      }(),
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "minify": {
        "removeComments": true,
        "collapseWhitespace": true,
        "removeAttributeQuotes": true
      },
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
      }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "name": [
        "inline"
      ],
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
        return module.resource
          && (module.resource.startsWith(nodeModules)
            || module.resource.startsWith(genDirNodeModules)
            || module.resource.startsWith(realNodeModules));
      },
      "chunks": [
        "main"
      ]
    }),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
    new CommonsChunkPlugin({
      "name": [
        "main"
      ],
      "minChunks": 2,
      "async": "common"
    }),
    new NamedModulesPlugin({}),
    new AotPlugin({
      "mainPath": "main.ts",
      "replaceExport": false,
      "hostReplacementPaths": {
        "environments\\environment.ts": "environments\\environment.ts"
      },
      "exclude": [],
      "tsConfigPath": `${srcDir}\\tsconfig.app.json`,
      "skipCodeGeneration": true
    }),
    new LoaderOptionsPlugin({
      minimize: true
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  },
  "devServer": {
    "historyApiFallback": true
  }
};
