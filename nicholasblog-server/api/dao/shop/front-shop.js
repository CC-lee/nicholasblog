var Item = require('../../../model/mongo').Item
var ItemPreview = require('../../../model/mongo').ItemPreview
var CartInfo = require('../../../model/mongo').CartInfo
var UserOrder = require('../../../model/mongo').UserOrder

module.exports = {
  // 创建
  // 创建购物车信息
  createCartInfo: (itemCart) => {
    return Promise.all([CartInfo.create(itemCart)])
  },
  // 创建用户订单
  createOrder: (order, userId) => {
    return Promise.all([
      UserOrder.create(order),
      CartInfo.remove({ user_id: userId }),
    ])
  },
  // 获取
  // 获取商品预览, 带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ItemPreview.find().sort({ create_date: -1 }).skip(skip).limit(limit),
        ItemPreview.count()
      ])
    } else {
      return ItemPreview.find().sort({ create_date: -1 })
    }
  },
  // 获取一件商品
  getItem: (itemId) => {
    return Item.findOne({ _id: itemId })
  },
  // 获取购物车列表
  getCartInfo: (userId) => {
    return CartInfo.find({ user_id: userId }).sort({ create_date: -1 })
  },
  searchCart: (userId, itemId) => {
    return CartInfo.find({ user_id: userId, item_id: itemId })
  },
  // 更新
  // 更新购物车信息
  updateCartInfo: (_id, info) => {
    return Promise.all([CartInfo.update({ _id: _id }, { $set: info })])
  },
  // 删除
  // 删除购物车商品
  deleteCartInfo: (_id) => {
    return Promise.all([CartInfo.remove({ _id: _id })])
  }
}

