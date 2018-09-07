import axios from 'axios'
import store from '../../store'
import axapi from './axios-api'
var instance = axapi.instance
var front_instance = axapi.front_instance
import common from './common-api';

var url = new common.Urlexe('user')
var headerSet = common.headerSet


export default {
  // 获取 登录功能
  // 获取用户账户信息
  getUserAccount(data) {
    return instance.post(url.exe('getUserAccount'), data, headerSet())
  },
  // 获取未读通知数量
  getNotifyNum(data) {
    return instance.post(url.exe('getNotifyNum'), data, headerSet())
  },
  // 获取通知列表
  getNotifyList(data) {
    return instance.post(url.exe('getNotifyList'), data, headerSet())
  },
  // 获取订单列表
  getOrderList(data) {
    return instance.post(url.exe('getOrderList'), data, headerSet())
  },
  // 获取一个订单
  getOneOrder(data) {
    return instance.post(url.exe('getOneOrder'), data, headerSet())
  },
  // 获取头像图片
  eidtLoadImage(data) {
    return instance.post(url.exe('editLoadImage'), data, headerSet())
  },
  // 获取用户信息列表
  getUserLists() {
    return instance.get(url.exe('getUserLists'), headerSet())
  },


  // 发送
  // 创建用户
  userRegister(data) {
    return instance.post(url.exe('userRegister'), data)
  },
  // 用户登录
  userLogin(data) {
    return instance.post(url.exe('userLogin'), data)
  },

  // 发送 登录功能
  // 删除订单
  deleteOneOrder(data) { 
    return instance.post(url.exe('deleteOneOrder'), data, headerSet())
  },
  // 删除未读通知
  deleteUnRead(data) { 
    return instance.post(url.exe('deleteUnReadNotify'), data, headerSet())
  },
  // 删除一条通知
  deleteOneNotify(data) { 
    return instance.post(url.exe('deleteOneNotify'), data, headerSet())
  },
  // 修改账户信息
  modifyUserAccount(data) {
    return instance.post(url.exe('modifyUserAccount'), data, headerSet())
  },
  // 修改密码
  modifyUserPassword(data) {
    return instance.post(url.exe('modifyUserPassword'), data, headerSet())
  },
  // 删除图片
  deleteImage(data) {
    return instance.post(url.exe('deleteImage'), data, headerSet())
  }
}