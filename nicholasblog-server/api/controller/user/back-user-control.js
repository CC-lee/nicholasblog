var apimodule = require('../../dao'),
  backUser = apimodule.backUser,
  control = require('../control'),
  commonControl = require('../common-control'),
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string'))
class bUser extends control {
  constructor({
        _id,
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
    Object.assign(this, { _id })
  }

  userList(res) {
    backUser.getUserList()
      .then((userList) => {
        urlAddArray(userList, 'user_avatar')
        this.getres(userList, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteUser(res) {
    backUser.deleteUser(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 用户信息列表
  userList: connectFun('userList', bUser),
  // 删除用户
  deleteUser: connectFun('deleteUser', bUser)
}
