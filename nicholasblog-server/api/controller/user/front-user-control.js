var apimodule = require('../../dao'),
  frontUser = apimodule.frontUser,
  control = require('../control'),
  sha1 = require('sha1'),
  createToken = require('../../../middleware/createToken'),
  commonControl = require('../common-control'),
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string'))
class fUser extends control {
  constructor({
    _id,
    email,
    password,
    passwordResetToken,
    passwordResetExpires,
    facebook,
    twitter,
    google,
    github,
    instagram,
    linkedin,
    steam,
    tokens,
    gender,
    location,
    website,
    user_id,
    user_avatar,
    user_name,
    create_date,
    update_date,
    timestamp,
    type,
      }) {
    super({
      user_id,
      user_avatar,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id })
    if (user_name) {
      this.user_name = `${user_name.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "")}`
    }
    if (email) {
      this.email = `${email.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "")}`
    }
    if (password) {
      Object.assign(this, { password: sha1(password) })
    }
    if (type) {
      if (type == 'register') {
        this.user = {
          email,
          user_name: this.user_name,
          password: sha1(password),
          gender,
          location,
          user_avatar,
          create_date: this.create_date,
          update_date: this.update_date,
          timestamp: this.timestamp
        }
      } else {
        this.user = {
          email,
          password,
          passwordResetToken,
          passwordResetExpires,
          facebook,
          twitter,
          google,
          github,
          instagram,
          linkedin,
          steam,
          tokens,
          profile: {
            user_name: this.user_name,
            gender,
            location,
            user_avatar: this.user_avatar
          },
          create_date: this.create_date,
          update_date: this.update_date,
          timestamp: this.timestamp
        }
      }
    }

    this.account = {
      user_name: this.user_name,
      gender,
      location,
      user_avatar: this.user_avatar,
      update_date: this.update_date
    }
    this.userinfo = {
      user_avatar: this.user_avatar,
      user_name: this.user_name,
    }
    this.userlist = {
      avatar: this.user_avatar,
      name: this.user_name,
    }

  }

  async userRegister(res) {
    var status = [];
    await frontUser.getUser(this.email)
      .then((account) => {
        if (account) {
          status.push('注册失败：该邮箱已被注册')
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
    await frontUser.getUserName(this.user_name)
      .then((account) => {
        if (account) {
          status.push('注册失败：该用户名已被注册')
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
    if (status.length === 0) {
      urlReplaceObject(this.user, 'user_avatar')
      urlReplaceString(this.user_avatar)
      await frontUser.createUser(this.user)
        .then(async (result) => {
          var { _id: userId } = result[0]
          var userlist = {
            userid: `${userId}`,
            email: this.email,
            avatar: this.user_avatar,
            name: this.user_name
          }
          await frontUser.userlistCreate(userlist)
            .then((result) => {
              this.createres(result, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
        .catch(err => {
          this.fail(res, err)
        })
    } else {
      if (status.length === 2) {
        res.send({
          code: 403,
          message: '注册失败：重复的邮箱及用户名'
        })
      } else {
        res.send({
          code: 403,
          message: status[0]
        })
      }
    }
  }

  userLogin(res) {
    frontUser.getUser(this.email)
      .then((user) => {
        let { _id, email, user_name, password, gender, location, user_avatar } = user
        if (password == this.password) {
          var account = {
            email,
            name: user_name,
            password: this.password
          }
          var profile = {
            _id, email, user_name, gender, location, user_avatar
          }
          res.send({
            code: 200,
            token: createToken(account),
            profile: profile
          })
        } else {
          res.send({
            code: -200,
            message: '登录错误'
          })
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getUserLists(res) {
    frontUser.getUserLists()
      .then((userLists) => {
        urlAddArray(userLists, 'avatar')
        this.getres(userLists, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getNotifyNum(res) {
    frontUser.getUnReadNotify(this._id)
      .then((num) => {
        this.getres(num, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getNotifyList(res) {
    frontUser.getNotify(this._id)
      .then((notify) => {
        this.getres(notify, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneNotify(res) {
    frontUser.deleteNotify(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOrderList(res) {
    frontUser.getOrderList(this.user_id)
      .then((orderList) => {
        this.getres(orderList, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  modifyUserPassword(res) {
    frontUser.updatePassword(this._id, { password: this.password })
      .then((result) => {
        var { ok, n } = result.slice(-1)[0]
        if (ok && n > 0) {
          var account = {
            email: this.email,
            name: this.user_name,
            password: this.password
          }
          res.send({
            code: 200,
            token: createToken(account),
            message: '编辑成功'
          })
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  async modifyUserAccount(res) {
    this.user_avatar = urlReplaceString(this.user_avatar)
    await frontUser.getUserName(this.user_name)
      .then((user) => {
        if (user && user.email !== this.email) {
          var account = {
            user_avatar: this.user_avatar
          }
          var userinfo = {
            user_avatar: this.user_avatar
          }
          var userlist = {
            avatar: this.user_avatar
          }
          frontUser.updateUser(this._id, account, userinfo, userlist)
            .then((result) => {
              res.send({
                code: 403,
                data: {
                  user_avatar: urlAddString(this.user_avatar)
                },
                message: '资料更改失败：该用户名已被注册'
              })
            })
            .catch(err => {
              this.fail(res, err)
            })
        } else {
          frontUser.updateUser(this._id, this.account, this.userinfo, this.userlist)
            .then((result) => {
              this.updateres(result, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getUserAccount(res) {
    frontUser.getUser(this.email)
      .then((account) => {
        let { _id, email, user_name, password, gender, location, user_avatar } = account
        user_avatar = urlAddString(user_avatar)
        var profile = {
          _id, email, user_name, gender, location, user_avatar
        }
        this.getres(profile, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneOrder(res) {
    frontUser.getOrder(this._id)
      .then((order) => {
        for (var i = 0; i < order.item_list.length; i++) {
          urlAddObject(order.item_list[i], 'item_img')
        }
        this.getres(order, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneOrder(res) {
    frontUser.deleteOrder(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteUnReadNotify(res) {
    frontUser.deleteUnReadNotify(this._id)
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
  // 创建用户
  userRegister: connectFun('userRegister', fUser),
  // 用户登录
  userLogin: connectFun('userLogin', fUser),
  // 获取所有用户列表
  getUserLists: connectFun('getUserLists', fUser),
  // 获取未读通知数量
  getNotifyNum: connectFun('getNotifyNum', fUser),
  // 获取通知列表
  getNotifyList: connectFun('getNotifyList', fUser),
  // 删除一条通知
  deleteOneNotify: connectFun('deleteOneNotify', fUser),
  // 获取订单列表
  getOrderList: connectFun('getOrderList', fUser),
  // 修改密码
  modifyUserPassword: connectFun('modifyUserPassword', fUser),
  // 修改账户信息
  modifyUserAccount: connectFun('modifyUserAccount', fUser),
  // 获取用户账户信息
  getUserAccount: connectFun('getUserAccount', fUser),
  // 获取一个订单
  getOneOrder: connectFun('getOneOrder', fUser),
  // 删除订单
  deleteOneOrder: connectFun('deleteOneOrder', fUser),
  // 清空未读信息
  deleteUnReadNotify: connectFun('deleteUnReadNotify', fUser)
}
