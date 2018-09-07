var Classify = require('../../../model/mongo').Classify
var ArticlePreview = require('../../../model/mongo').ArticlePreview
var { Observable } = require('rxjs')
var { from } = require('rxjs/observable/from')
var { forkJoin } = require('rxjs/observable/forkJoin');
module.exports = {
  // 创建
  // 获取
  // 获取所有分类
  getAllClass: () => {
    return from(Classify.find().sort({ create_date: -1 }))
  },
  getSearchClass: (key) => {
    return Classify.find({ classify: { $regex: `${key}`, $options: 'i' } }).sort({ create_date: -1 })
  },
  getSummaryByClass: (classify, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ArticlePreview.find({ classify: classify, title: "汇总" }).sort({ create_date: -1 }).skip(skip).limit(limit),
        ArticlePreview.count({ classify: classify, title: "汇总" })
      ])
    } else {
      return ArticlePreview.find({ classify: classify, title: "汇总" }).sort({ create_date: -1 })
    }
  },
  // 根据分类获取文章预览列表
  getArticlesByClass: (classify, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ArticlePreview.find({ classify: classify, title: { $ne: "汇总" } }).sort({ create_date: -1 }).skip(skip).limit(limit),
        ArticlePreview.count({ classify: classify, title: { $ne: "汇总" } })
      ])
    } else {
      return ArticlePreview.find({ classify: classify, title: { $ne: "汇总" } }).sort({ create_date: -1 })
    }
  }
  // 更新
  // 删除
}
