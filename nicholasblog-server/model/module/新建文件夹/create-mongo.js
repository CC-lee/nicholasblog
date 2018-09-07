var admin = require('./admin-mongo')
var article = require('./article-mongo')
var classify = require('./class-mongo')
var message = require('./message-mongo')
var album = require('./album-mongo')
var shop = require('./shop-mongo')
var user = require('./user-mongo')
var Mongolass = require('mongolass')
var mongolass = new Mongolass()
module.exports = {
  ArticleTemp: mongolass.model('ArticleTemp', article.ArticleTemp),
  MessageTemp: mongolass.model('MessageTemp', message.MessageTemp),
  ImageTemp: mongolass.model('ImageTemp', album.ImageTemp),
  ItemTemp: mongolass.model('ItemTemp', shop.ItemTemp)
}