<template src="./Home.html"></template>

<script>
import api from 'api'
import aboutme from 'public/aboutme/aboutme'
import updateinfo from 'public/updateinfo/updateinfo'
import backtop from 'public/backtop/backtop'
import articlesl from './home/ArticleShowList/ArticleShowList'
import { mapGetters } from 'vuex'
import execlib from '../lib/execlib'
export default {
  data() {
    return {
      items: [],
      loadMoreText: '加载更多',
      loadMoreShow: false,
      loadMoreSearch: false,
      page: 1,
      limit: 6,
      scroll: '',
      scrollHeight: '',
      offsetHeight: '',
      scrollTop: '',
      key: []
    }
  },
  components: {
    aboutme,
    updateinfo,
    backtop,
    articlesl
  },
  computed: {
    ...mapGetters({
      loggedIn: 'global/getLog',
      profile: 'global/getProfile',
      position: 'message/getposition'
    })
  },
  methods: {
    menu() {
      this.scrollHeight = document.body.scrollHeight
      this.offsetHeight = document.body.offsetHeight
      this.scrollTop = $(document).scrollTop()
      this.scroll = this.scrollTop + this.offsetHeight
      if (this.loadMoreShow === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreText = '加载中'
          this.loadMoreShow = false
          this.loadData(this.page, this.limit)
        }
      }
      if (this.loadMoreSearch === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreText = '加载中'
          this.loadMoreSearch = false
          this.loadSearch(this.page, this.limit, this.key)
        }
      }
    },
    judgeLoad(page, limit) {
      if (localStorage.getItem(execlib.tokenName)) {
        if (this.profile._id) {
          if (this.$route.name === 'articlesearch') {
            this.key = this.key.concat(this.reset())
            this.loadSearch(page, limit, this.key)
          } else {
            this.loadData(page, limit)
          }
        }
      } else {
        if (this.$route.name === 'articlesearch') {
          this.key = this.key.concat(this.reset())
          this.loadSearch(page, limit, this.key)
        } else {
          this.loadData(page, limit)
        }
      }
    },
    loadData(page, limit) {
      api.article
        .articlePreview({
          page,
          limit,
          user_id: this.profile._id
        })
        .then(result => {
          let { code, preview, hasNext } = result.data
          if (code === 200) {
            setTimeout(() => {
              this.items = this.items.concat(
                JSON.parse(JSON.stringify(preview))
              )
              if (hasNext) {
                this.loadMoreShow = true
                this.loadMoreText = '加载更多'
                this.page++
              } else {
                this.loadMoreShow = false
              }
            }, 300)
          }
        })
    },
    loadSearch(page, limit, keyArray) {
      api.article
        .getArticlesBySearch({ page, limit, key: keyArray })
        .then(result => {
          let { code, preview, hasNext } = result.data
          if (code === 200) {
            setTimeout(() => {
              this.items = this.items.concat(preview)
              if (hasNext) {
                this.loadMoreSearch = true
                this.loadMoreText = '加载更多'
                this.page++
              } else {
                this.loadMoreSearch = false
              }
            }, 200)
          }
        })
    },
    reset() {
      if (this.$route.name === 'articlesearch') {
        this.page = 1
        document.title = `${this.$route.params
          .text} - 文章搜索-- Nicholas Lee's Blog`
        var keys = this.$route.params.text.split(' '),
          keyArray = []
        for (var i = 0, len = keys.length; i < len; i++) {
          keyArray.push({ title: { $regex: keys[i], $options: 'igm' } })
          keyArray.push({ content: { $regex: keys[i], $options: 'igm' } })
        }
        this.items = []
        this.loadMoreShow = false
        return keyArray
      } else {
        this.items = []
        this.page = 1
        this.loadMoreSearch = false
      }
    }
  },
  created() {},
  mounted() {
    // 封装成一个方法，与分页获取文章列表类似
    this.judgeLoad(1, 6)
    window.addEventListener('scroll', this.menu)
  },
  watch: {
    '$route.path': function() {
      if (this.$route.name === 'articlesearch') {
        this.key = this.key.concat(this.reset())
        this.loadSearch(1, 6, this.key)
      } else {
        this.reset()
        this.loadData(1, 6)
      }
    },
    profile: function() {
      this.judgeLoad(1, 6)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.menu)
  }
}
</script>

<style lang="scss" scoped>
@import './home/Home.scss';
</style>