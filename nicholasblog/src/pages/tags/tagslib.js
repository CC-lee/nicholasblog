import api from "api";
function on() {
  this.$on("execute", function (fn, args, that) {
    fn.apply(that, args);
  });
}
// 获取所有分类
function classList() {
  api.classify
    .classList()
    .then(({ data: { code, data } }) => {
      if (code === 200) {
        setTimeout(() => {
          this.itemsStore = data;
          if (this.$route.name === "tags" || this.$route.name === "tagsarticles") {
            this.items = data;
          }
        }, 200);
      }
    })
    .catch(err => {
      alert(err.message);
    });
}
// 获取特定分类
function specificClassList(key) {
  api.classify.specificClassList({ key: key }).then(({ data: { code, data } }) => {
    if (code === 200) {
      setTimeout(() => {
        this.items = data;
      }, 200);
    }
  })
}
// 根据分类获取文章
// 未注册的状态
function loadArticleUnloggin(classify, page, limit) {
  api.classify
    .getArticlesByClass({ classify, page, limit })
    .then(({ data: { code, data, hasNext } }) => {
      if (code === 200) {
        this.articleLists = this.articleLists.concat(data);
        setTimeout(() => {
          this.show = true;
          if (hasNext) {
            this.loadMoreShow = true;
          }
        }, 200);
      }
    });
}
// 已注册的状态
function loadArticleLoggin(classify, page, limit) {
  api.classify
    .getArticlesByClass({ classify, page, limit, user_id: this.profile._id })
    .then(({ data: { code, data, hasNext } }) => {
      if (code === 200) {
        this.articleLists = this.articleLists.concat(data);
        setTimeout(() => {
          this.show = true;
          if (hasNext) {
            this.loadMoreShow = true;
            this.page++;
          }else{
            this.loadMoreShow = false;
          }
        }, 200);
      }
    });
}
export default {
  on,
  classList,
  loadArticleUnloggin,
  loadArticleLoggin,
  specificClassList
}