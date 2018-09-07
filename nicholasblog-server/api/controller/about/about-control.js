var apimodule = require('../../dao'),
  frontArticle = apimodule.frontArticle,
  commonControl = require('../common-control'),
  control = require('../control')

class About extends control  {
  constructor() {
    super({})
  }
  aboutList(res) {
    frontArticle.getResumeArticles(res)
      .then((list) => {
        this.getres(list, res)
      }).catch(err => {
        this.fail(res, err)
      })
  }
}
var connectFun = commonControl.bindFun(this, commonControl.connectFun)
module.exports = {
  // 获取所有文章
  aboutList: connectFun('aboutList', About)
}