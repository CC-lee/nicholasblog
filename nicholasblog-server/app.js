var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var routes = require('./routes')
var commonSet = require('./commonSet')

global.__base = __dirname + '/';
require('module-alias/register')
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

// 跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', commonSet.frontUrl)
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
routes(app)
app.set('port', process.env.PORT || commonSet.portName)
app.listen(app.get('port'), commonSet.hostName, function () {
  console.log('Express server listening on port ' + app.get('port'))
})
