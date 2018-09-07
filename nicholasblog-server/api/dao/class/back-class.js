var Classify = require('../../../model/mongo').Classify
var Article = require('../../../model/mongo').Article
var ArticlePreview = require('../../../model/mongo').ArticlePreview
var ArticleInfo = require('../../../model/mongo').ArticleInfo
module.exports = {
  // 创建
  // 根据外部参数创建分类
  createClass: (classify) => {
    return Promise.all([Classify.create(classify)])
  },
  // 获取
  // 获取所有分类
  getAllClass: () => {
    return Classify.find().sort({ update_date: -1 })
  },
  // 获取一个分类
  getOneClass: (classId) => {
    return Classify.findOne({ _id: classId })
  },
  // 更新
  // 根据外部参数编辑分类
  // 只编辑分类
  updateClassOnly: (classId, classify) => {
    return Promise.all([Classify.update({ _id: classId }, { $set: classify })])
  },
  // 编辑分类与相关文章
  updateClass: (classId, classi, classify) => {
    return Promise.all([
      Classify.update({ _id: classId }, { $set: classify }),
      Article.update({ classify: classi }, { $set: { classify: classify.classify } }, { multi: true }),
      ArticlePreview.update({ classify: classi }, { $set: { classify: classify.classify } }, { multi: true }),
      ArticleInfo.update({ classify: classi }, { $set: { classify: classify.classify } }, { multi: true })
    ])
  },
  // 删除
  // 根据外部参数删除分类
  removeClass: (classId) => {
    return Promise.all([Classify.remove({ _id: classId })])
  }
}
