var mongoose = require('mongoose');
var create = require('./module/create-mongo')
mongoose.connect('mongodb://localhost:27017/NicholasBlog').then(x => {
  mongoose.connection.db.collections().then(x => {
    if (x.length === 0) {
      create.ArticleTemp().create({
        title: '',
        content: '',
        classify: ''
      })
      create.ImageTemp().create({
        image_content: '',
        text_content: ''
      })
      create.ItemTemp().create({
        item_name: '',
        unit_price: '',
        item_img: [],
        item_detail: '',
        item_option: []
      })
      create.MessageTemp().create({
        content: '',
        img: [],
        notify: []
      })
    }
  });
});
var admin = require('./module/admin-mongo')
var article = require('./module/article-mongo')
var classify = require('./module/class-mongo')
var message = require('./module/message-mongo')
var album = require('./module/album-mongo')
var shop = require('./module/shop-mongo')
var user = require('./module/user-mongo')

module.exports = {
  // 管理
  Admin: mongoose.model('Admin', admin.AdminInfo),
  // 文章
  // 文章
  Article: mongoose.model('Article', article.Article),
  // 文章草稿数据
  ArticleTemp: mongoose.model('ArticleTemp', article.ArticleTemp),
  // 文章赞
  ArticleLike: mongoose.model('ArticleLike', article.ArticleLike),
  // 文章预览
  ArticlePreview: mongoose.model('ArticlePreview', article.ArticlePreview),
  // 文章列表信息
  ArticleInfo: mongoose.model('ArticleInfo', article.ArticleInfo),
  // 文章评论
  ArticleComment: mongoose.model('ArticleComment', article.ArticleComment),
  // 文章评论赞
  ArticleCommentLike: mongoose.model('ArticleCommentLike', article.ArticleCommentLike),
  // 文章评论回复
  ArticleCommentReply: mongoose.model('ArticleCommentReply', article.ArticleCommentReply),

  // 分类
  // 分类
  Classify: mongoose.model('Classify', classify.Classify),

  // 留言板
  // 留言
  Message: mongoose.model('Message', message.Message),
  // 留言评论
  MessageComment: mongoose.model('MessageComment', message.MessageComment),
  // 留言回复
  MessageCommentReply: mongoose.model('MessageCommentReply', message.MessageCommentReply),
  // 留言赞
  MessageLike: mongoose.model('MessageLike', message.MessageLike),
  // 留言评论赞
  MessageCommentLike: mongoose.model('MessageCommentLike', message.MessageCommentLike),
  // 留言预览
  MessagePreview: mongoose.model('MessagePreview', message.MessagePreview),
  // 留言列表信息
  MessageInfo: mongoose.model('MessageInfo', message.MessageInfo),
  // 管理留言草稿数据
  MessageTemp: mongoose.model('MessageTemp', message.MessageTemp),

  // 相册
  // 图片
  Image: mongoose.model('Image', album.Image),
  // 图片评论
  ImageComment: mongoose.model('ImageComment', album.ImageComment),
  // 图片点赞
  ImageLike: mongoose.model('ImageLike', album.ImageLike),
  // 图片评论点赞
  ImageCommentLike: mongoose.model('ImageCommentLike', album.ImageCommentLike),
  // 图片预览
  ImagePreview: mongoose.model('ImagePreview', album.ImagePreview),
  // 图片列表信息
  ImageInfo: mongoose.model('ImageInfo', album.ImageInfo),
  // 图片草稿数据
  ImageTemp: mongoose.model('ImageTemp', album.ImageTemp),

  // 商店
  // 商品
  Item: mongoose.model('Item', shop.Item),
  // 商品预览
  ItemPreview: mongoose.model('ItemPreview', shop.ItemPreview),
  // 购物车
  CartInfo: mongoose.model('CartInfo', shop.CartInfo),
  // 商品列表信息
  ItemInfo: mongoose.model('ItemInfo', shop.ItemInfo),
  // 商品草稿数据
  ItemTemp: mongoose.model('ItemTemp', shop.ItemTemp),

  // 用户
  // 用户账号
  User: mongoose.model('User', user.User),
  // 用户信息
  UserList: mongoose.model('UserList', user.UserList),
  // 用户订单
  UserOrder: mongoose.model('UserOrder', user.UserOrder),
  // 用户通知
  UserNotify: mongoose.model('UserNotify', user.UserNotify),
  // 未读通知
  UnReadNotify: mongoose.model('UnReadNotify', user.UnReadNotify)
}
