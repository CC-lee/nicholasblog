<template src="./Album.html"></template>
<script>
import api from 'api'
import { mapGetters } from 'vuex'
import execlib from 'execlib'
export default {
  data() {
    return {
      items: [],
      loadMoreShow: false,
      page: 1,
      limit: 6,
      scroll: '',
      scrollHeight: '',
      offsetHeight: '',
      scrollTop: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      status: 'album/getstatus'
    })
  },
  methods: {
    router(string) {
      this.$store.commit('album/saveposition', $(document).scrollTop())
      this.$router.push(`/album/${string}`)
    },
    menu() {
      this.scrollHeight = document.body.scrollHeight
      this.offsetHeight = document.body.offsetHeight
      this.scrollTop = $(document).scrollTop()
      this.scroll = this.scrollTop + this.offsetHeight
      if (this.loadMoreShow === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreShow = false
          this.loadData(this.page, this.limit)
        }
      }
    },
    loadData(page, limit) {
      api.album
        .albumList({ page, limit })
        .then(result => {
          let { code, preview, hasNext } = result.data
          if (code === 200) {
            this.items = this.items.concat(preview)
            if (hasNext) {
              this.loadMoreShow = true
              this.page++
            } else {
              this.loadMoreShow = false
            }
          }
        })
        .catch(err => {
          alert(err.message)
        })
    }
  },
  mounted() {
    if (this.status == 'album') {
      this.loadData(1, 6)
    }
    this.$store.dispatch('shop/actpos', 20)
    window.addEventListener('scroll', this.menu)
  },
  watch: {
    status: function() {
      if (this.status == 'album' && this.items.length == 0) {
        this.loadData(1, 6)
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('album/saveposition', 0)
    window.addEventListener('scroll', this.menu)
  }
}
</script>
<style lang="scss" scoped>
@import './Album.scss';
</style>