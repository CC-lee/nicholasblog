var controller = require('./controller')
var Article = controller.frontArticle
var Class = controller.frontClass
var Message = controller.frontMessage
var Album = controller.frontAlbum
var Shop = controller.frontShop
var User = controller.frontUser
var About = controller.about
module.exports = {
  article: Article,
  class: Class,
  message: Message,
  album: Album,
  shop: Shop,
  user: User,
  about: About
}
