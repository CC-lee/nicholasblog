var Admin = require('../../../model/mongo').Admin
var Message = require('../../../model/mongo').Message
var ArticleTemp = require('../../../model/mongo').ArticleTemp
var MessageTemp = require('../../../model/mongo').MessageTemp
var ImageTemp = require('../../../model/mongo').ImageTemp
var ItemTemp = require('../../../model/mongo').ItemTemp

module.exports = {
  // 创建
  // 创建一个管理账号
  createAdmin: ({ admin, articleTemp, messageTemp, imageTemp, itemTemp }) => {
    return Promise.all([
      Admin.create(admin)
    ])
  },
  // 获取
  // 获取一个管理账号
  getAdmin: (email) => {
    var obj = { 'email': email }
    return Admin.findOne(obj)
  },
  // 更新
  // 更新一个管理账号
  updateAdmin: (adminId, { admin, message }) => {
    return Promise.all([
      Admin.update({ _id: `${adminId}` }, { $set: admin }),
      Message.update({ user_id: `${adminId}` }, { $set: message }, { multi: true })
    ])
  }
  // 删除
}
