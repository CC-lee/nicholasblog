var Item = require('../../../model/mongo').Item
var ItemPreview = require('../../../model/mongo').ItemPreview
var CartInfo = require('../../../model/mongo').CartInfo
var ItemInfo = require('../../../model/mongo').ItemInfo
var ItemTemp = require('../../../model/mongo').ItemTemp
var UserOrder = require('../../../model/mongo').UserOrder

module.exports = {
  // 创建
  // 创建商品
  createItem: (item, { tempId, temp }) => {
    return Promise.all([
      Item.create(item),
      ItemTemp.update({ _id: tempId }, { $set: temp })
    ])
  },
  createItemPvIf: ({ preview, info }) => {
    return Promise.all([
      ItemPreview.create(preview),
      ItemInfo.create(info)
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return ItemTemp.find().sort({ _id: -1 })
  },
  // 获取商品信息列表
  getItemInfo: () => {
    return ItemInfo.find().sort({ _id: -1 })
  },
  // 获取商品
  getItem: (itemId) => {
    return Item.findOne({ _id: itemId })
  },
  // 获取用户订单列表
  getOrderList: () => {
    return UserOrder.find().sort({ create_date: -1 })
  },
  // 获取一个用户订单
  getOrder: (orderId) => {
    return UserOrder.findOne({ _id: orderId })
  },
  // 更新
  // 更新临时数据
  updateTemp: ({ tempId, temp }) => {
    return ItemTemp.update({ _id: tempId }, { $set: temp })
  },
  // 更新商品
  updateItem: (itemId, { item, preview, info }) => {
    return Promise.all([
      Item.update({ _id: itemId }, { $set: item }),
      ItemPreview.update({ item_id: itemId }, { $set: preview }),
      ItemInfo.update({ item_id: itemId }, { $set: info })
    ])
  },
  // 更新用户订单
  updateOrder: (id, order) => {
    return Promise.all([UserOrder.update({ _id: id }, { $set: order })])
  },
  // 删除
  // 删除商品
  deleteItem: (itemId) => {
    return Promise.all([
      Item.remove({ _id: itemId }),
      ItemPreview.remove({ item_id: itemId }),
      ItemInfo.remove({ item_id: itemId }),
    ])
  }
}

