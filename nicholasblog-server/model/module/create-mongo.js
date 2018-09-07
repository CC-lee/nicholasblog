var admin = require('./admin-mongo')
var article = require('./article-mongo')
var classify = require('./class-mongo')
var message = require('./message-mongo')
var album = require('./album-mongo')
var shop = require('./shop-mongo')
var user = require('./user-mongo')
var mongoose = require('mongoose');
module.exports = {
  ArticleTemp: function () {
    return mongoose.model('ArticleTemp', article.ArticleTemp)
  },
  MessageTemp: function () {
    return mongoose.model('MessageTemp', message.MessageTemp)
  },

  ImageTemp: function () {
    return mongoose.model('ImageTemp', album.ImageTemp)
  },
  ItemTemp: function () {
    return mongoose.model('ItemTemp', shop.ItemTemp)
  }
}