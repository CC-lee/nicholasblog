import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
var instance = axapi.instance
var front_instance = axapi.front_instance
import common from './common-api';
import { Observable } from "rxjs";
import { from } from "rxjs/observable/from";

var url = new common.Urlexe('shop')
var headerSet = common.headerSet

export default {
  // 获取
  // 商店列表
  shopList(data) {
    return from(instance.post(url.exe('shopList'), data))//Observable.fromPromise(instance.post(url('shopList'), data))
  },
  // 获取一件商品
  getOneItem(data) {
    return instance.post(url.exe('frontOneItem'), data)
  },

  // 获取 登录功能
  // 获取购物车列表
  userShopCart(data) {
    return instance.post(url.exe('userShopCart'), data, headerSet())
  },

  // 发送 登录功能
  // 发送购物车信息
  shopCartInfo(data) {
    return instance.post(url.exe('shopCartInfo'), data, headerSet())
  },
  // 创建订单
  createOrder(data) {
    return instance.post(url.exe('createOrder'), data, headerSet())
  },
  // 删除
  // 删除购物车商品
  deleteCartInfo(data) {
    return instance.post(url.exe('deleteCartInfo'), data, headerSet())
  }

}