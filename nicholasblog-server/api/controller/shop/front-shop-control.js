var apimodule = require('../../dao'),
  frontShop = apimodule.frontShop,
  control = require('../control'),
  commonControl = require('../common-control'),
  filePrefix = require('../common-control').commonSet.filePrefix,
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string'))

class fShop extends control {
  constructor({
    _id,
    page,
    limit,
    item_id,
    item_img,
    item_name,
    unit_price,
    quantity,
    price,
    item_option,
    item_list,
    total_price,
    user_id,
    user_avatar,
    user_name,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      create_date,
      update_date,
      timestamp
    })
    this.itemCart = {
      user_id: this.user_id,
      item_id,
      item_img,
      item_name,
      unit_price,
      quantity,
      price,
      item_option,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.order = {
      user_id: this.user_id,
      user_name: this.user_name,
      item_list,
      total_price,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    Object.assign(this, { _id, item_id, page, limit, quantity, price, item_option })
  }

  getOneItem(res) {
    frontShop.getItem(this._id)
      .then((item) => {
        var arrs = item.item_img[0].match(/shop\//g)
        if (!arrs) {
          for (var i = 0; i < item.item_img.length; i++) {
            item.item_img[i] = `shop/${this._id}/${item.item_img[i]}`
          }
        }
        urlAddObject(item, 'item_img')
        this.getres(item, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  shopList(res) {
    frontShop.getPreview({ page: this.page, limit: this.limit })
      .then((result) => {
        var preview = result[0],
          total = result[1],
          totalPage = Math.ceil(total / this.limit),
          hasNext = totalPage > this.page ? 1 : 0
        urlAddArray(preview, 'preview_img')
        res.send({
          code: 200,
          preview: preview,
          hasNext: hasNext
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  userShopCart(res) {
    frontShop.getCartInfo(this.user_id)
      .then((shopCart) => {
        urlAddArray(shopCart, 'item_img')
        this.getres(shopCart, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  shopCartInfo(res) {
    var finish = false
    frontShop.searchCart(this.user_id, this.item_id)
      .then((result) => {
        if (result.length > 0) {
          for (var n = 0; n < result.length; n++) {
            if (n < result.length - 1) {
              for (var i = 0; i < this.item_option.length; i++) {
                if (this.item_option[i].value == result[n].item_option[i].value) {
                  if (i == this.item_option.length - 1) {
                    finish = true
                    frontShop.updateCartInfo(result[n]._id, {
                      quantity: result[n].quantity + this.quantity,
                      price: this.price + result[n].price
                    })
                      .then((result) => {
                        this.updateres(result, res)
                      })
                      .catch(err => {
                        this.fail(res, err)
                      })
                  }
                }
              }
            } else if (n == result.length - 1 && finish == false) {
              for (var i = 0; i < this.item_option.length; i++) {
                if (this.item_option[i].value == result[n].item_option[i].value) {
                  if (i == this.item_option.length - 1) {
                    frontShop.updateCartInfo(result[n]._id, {
                      quantity: result[n].quantity + this.quantity,
                      price: this.price + result[n].price
                    })
                      .then((result) => {
                        this.updateres(result, res)
                      })
                      .catch(err => {
                        this.fail(res, err)
                      })
                  }
                } else {
                  urlReplaceObject(this.itemCart,'item_img')
                  frontShop.createCartInfo(this.itemCart)
                    .then((result) => {
                      this.createres(result, res)
                    })
                    .catch(err => {
                      this.fail(res, err)
                    })
                }
              }
            }
          }
        } else {
          urlReplaceObject(this.itemCart,'item_img')
          frontShop.createCartInfo(this.itemCart)
            .then((result) => {
              this.createres(result, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        }
      })
  }

  deleteCartInfo(res) {
    frontShop.deleteCartInfo(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  createOrder(res) {
    for (var i = 0; i < this.order.item_list.length; i++) {
      urlReplaceObject(this.order.item_list[i], 'item_img')
    }
    frontShop.createOrder(this.order, this.user_id)
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 获取一件商品
  getOneItem: connectFun('getOneItem', fShop),
  // 商店列表
  shopList: connectFun('shopList', fShop),
  // 获取购物车列表
  userShopCart: connectFun('userShopCart', fShop),
  // 发送购物车信息
  shopCartInfo: connectFun('shopCartInfo', fShop),
  // 删除购物车商品
  deleteCartInfo: connectFun('deleteCartInfo', fShop),
  // 创建用户订单
  createOrder: connectFun('createOrder', fShop),
}
