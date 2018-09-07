var apimodule = require('../../dao')
var frontClass = apimodule.frontClass
var frontArticle = apimodule.frontArticle
var control = require('../control')
var _ = require('lodash')
var commonControl = require('../common-control'),
  filePrefix = commonControl.commonSet.filePrefix,
  urlReplaceObject = commonControl.bindFun(this, commonControl.urlReplaceSet('object')),
  urlReplaceString = commonControl.bindFun(this, commonControl.urlReplaceSet('string')),
  urlAddObject = commonControl.bindFun(this, commonControl.urlAddSet('object')),
  urlAddArray = commonControl.bindFun(this, commonControl.urlAddSet('array')),
  urlAddString = commonControl.bindFun(this, commonControl.urlAddSet('string')),
  { Rx } = require('rxjs'),
  { Observable } = require('rxjs/Observable'),
  { Subject } = require('rxjs/Subject'),
  { BehaviorSubject } = require('rxjs/BehaviorSubject'),
  { from } = require('rxjs'),
  { defer } = require('rxjs/observable/defer'),
  { of } = require('rxjs/observable/of'),
  { fromPromise } = require('rxjs/observable/fromPromise'),
  { concatMap, mergeMap, pluck, flatMap, last, map, find, filter,
    partition, concat, toArray, tap, scan, isEmpty, zip, combineLatest,
    shareReplay, refCount, publishReplay } = require('rxjs/operators')

class fClass extends control {
  constructor({ classify, user_id, article_id, key, page, limit }) {
    super({
      user_id
    })
    Object.assign(this, { classify, article_id, key, page, limit })
  }
  classList(res) {
    frontClass.getAllClass()
      .pipe(concatMap(
        x => {
          var parts = from(x).pipe(
            partition(x => x.classify.match(/置顶/ig))
          )
          return from([]).pipe(
            concat(parts[0], parts[1]),
            toArray()
          )
        }
      ))
      .subscribe(
      (list) => {
        this.getres(list, res)
      },
      err => {
        this.fail(res, err)
      })
    /**var index = _.findIndex(list, { classify: '置顶' })
    if (index > 0) {
      var data = []
      data.push(list[index])
      list.splice(index, 1)
      list = data.concat(list)
    }
    this.getres(list, res)**/
    /**.catch(err => {
      this.fail(res, err)
    })**/
  }

  specificClassList(res) {
    frontClass.getSearchClass(this.key)
      .then((list) => {
        this.getres(list, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getArticlesByClass(res) {
    var that = this
    var articles = {
      data: [],
      hasNext: null,
      likes: []
    }
    //var subjector = from(new Promise(resolve => resolve({ arrs: [1, 2, 3] }))).subscribe(x => { console.log(x); })
    var articleSubject = new BehaviorSubject(JSON.parse(JSON.stringify(articles)));
    //var articleSource = articleSubject.asObservable();
    var articleSource = from(new Promise(resolve => resolve(JSON.parse(JSON.stringify(articles)))))
    articleSource.pipe(
      concatMap(obj => {
        var step1 = from(new Promise(resolve => resolve([])))
        var step2 = from(new Promise(resolve => resolve([])))
        var step3 = from(new Promise(resolve => resolve([])))
        if (this.user_id) {
          step1 = defer(() => {
            return frontArticle.getLike(this.user_id, this.article_id)
          }).pipe(concatMap(result => {
            obj.likes = result
            return of(obj)
          }))
        }
        if (this.page === 1) {
          step2 = defer(() => {
            return frontClass.getSummaryByClass(this.classify, this.page, this.limit)
          }).pipe(concatMap(result => {
            var preview = result[0]
            return of(preview)
          }),
            concatMap(preview => {
              if (preview.length > 0) {
                _.map(preview, prev => {
                  if (prev['theme_img']) {
                    urlAddObject(prev, 'theme_img')
                  }
                  if (prev.like_num > 0 && obj.likes.length > 0) {
                    _.map(obj.likes, like => {
                      if (like.user_id === that.user_id && like.article_id === prev.article_id) {
                        prev.like_status = true
                      }
                    })
                  }
                })
                obj.data = obj.data.concat(preview)
              }
              return of(obj)
            }))
        }
        step3 = defer(() => {
          return frontClass.getArticlesByClass(this.classify, this.page, this.limit)
        }).pipe(
          concatMap(result => {
            var preview = result[0],
              total = result[1],
              totalPage = Math.ceil(total / this.limit),
              hasNext = totalPage > this.page ? 1 : 0
            obj.hasNext = hasNext
            return of(preview)
          }),
          concatMap(preview => {
            if (preview.length > 0) {
              _.map(preview, prev => {
                if (prev['theme_img']) {
                  urlAddObject(prev, 'theme_img')
                }
                if (prev.like_num > 0 && obj.likes.length > 0) {
                  _.map(obj.likes, like => {
                    if (like.user_id === that.user_id && like.article_id === prev.article_id) {
                      prev.like_status = true
                    }
                  })
                }
              })
              obj.data = obj.data.concat(preview)
            }
            return of(obj)
          })
          )
        return from(new Promise(resolve => resolve([]))).pipe(
          concat(step1, step2, step3),
          scan((acc, curr) => Object.assign({}, { code: 200, data: acc.data, hasNext: acc.hasNext }, { data: curr.data, hasNext: curr.hasNext }), {}),
          last()
        )
      })
    )
      .subscribe(
      (array) => {
        res.send(array)
      },
      err => {
        this.fail(res, err)
      })
  }
}

var connectFun = commonControl.bindFun(this, commonControl.connectFun)

module.exports = {
  // 获取所有分类
  classList: connectFun('classList', fClass),
  // 获取分类搜索
  specificClassList: connectFun('specificClassList', fClass),
  // 根据分类获取文章
  getArticlesByClass: connectFun('getArticlesByClass', fClass)
}
