<template src="./vheader.html"></template>

<script>
import { mapGetters } from 'vuex'
import sendmessage from '../sendmessage/sendmessage'
import execlib from 'execlib'
export default {
  data() {
    return {
      search: '搜索文章',
      redInform: false,
      searchContent: '搜索文章',
      hostBackMainPath: execlib.hostBackMainPath
    }
  },
  components: {
    sendmessage
  },
  methods: {
    focusFun(event) {
      if (event.target.value.replace(/搜索文章|搜索留言/g, '').length === 0) {
        event.target.value = ''
        this.searchContent = ''
      }
    },
    searchFun(event) {
      if (event.keyCode == 13) {
        event.preventDefault && event.preventDefault()
        var arrs = event.target.value.split(/\s+/gi)
        if (arrs) {
          if (this.message) {
            if (this.$route.name === 'messagesearch') {
              this.$store.commit('message/enableSearch', `${Date.now()}`)
            }
            this.$refs.searchInput.blur()
            this.$router.push(`/search/messageboard/${arrs.join(' ')}`)
          } else {
            this.$refs.searchInput.blur()
            this.$router.push(`/search/article/${arrs.join(' ')}`)
          }
        }
      } else if (event.target.id === 'searchSubmit') {
        event.preventDefault && event.preventDefault()
        alert(this.searchContent)
      }
    },
    blur(event) {
      if (event.target.value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
        event.target.value = this.search
      }
    },
    signout() {
      this.$store.dispatch('global/logout')
    },
    turnred() {
      if (this.notifyNum > 0) {
        $('#notify').css({ color: 'red' })
      }
    },
    router(string) {
      this.$router.push(`/user/${this.profile._id}/${string}`)
    },
    preventWheel(e) {
      if (
        e.target.parentNode.parentNode.id == 'navLink' ||
        e.target.id == 'navLink'
      ) {
      } else {
        e.preventDefault && e.preventDefault()
      }
    },
    showSideBar() {
      this.$refs.sideNav.style.width = '100%'
      document.body.style.overflow = 'hidden'
    },
    backSideBar() {
      this.$refs.sideNav.style.width = '0'
      document.body.style.overflow = null
    },
    touchListen() {
      var that = this
      var mouse_x
      var mouse_y
      window.addEventListener('touchstart', function(event) {
        mouse_x = event.pageX
        mouse_y = event.pageY
      })
      window.addEventListener('touchmove', function(event) {
        var new_mouse_x = event.pageX
        if (that.$route.name !== 'article') {
          if (new_mouse_x - mouse_x > 75) {
            //swiped right
            that.showSideBar()
          } else if (new_mouse_x - mouse_x < -75) {
            //swiped left
          }
        } else {
          if (
            event.target.tagName === 'PRE' ||
            event.target.tagName === 'CODE' ||
            event.target.tagName === 'SPAN'
          ) {
          } else {
            if (new_mouse_x - mouse_x > 75) {
              //swiped right
              that.showSideBar()
            }
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      notifyNum: 'global/getNum',
      loggedIn: 'global/getLog',
      profile: 'global/getProfile',
      message: 'global/getMessage'
    })
  },
  mounted() {
    this.turnred()
    this.touchListen()
  },
  watch: {
    message: function() {
      if (this.message) {
        this.search = '搜索留言'
        this.searchContent = '搜索留言'
        $('#search').addClass('search-container-active')
        $('#search').removeClass('search-container')
      } else {
        this.search = '搜索文章'
        this.searchContent = '搜索文章'
        $('#search').addClass('search-container')
        $('#search').removeClass('search-container-active')
      }
    },
    '$route.path': function() {
      if (!this.message) {
        this.$refs.searchInput.value = this.search
      }
    },
    loggedIn: function() {},
    notifyNum: function() {
      if (this.notifyNum > 0) {
        this.redInform = true
      }
    },
    $route() {
      if (this.$refs.sideNav.style.width != '0') {
        this.backSideBar()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/frontend/public.css';
@import './vheader.scss';

header {
  height: 30rem;
  display: flex;
  flex-direction: column;
}

.bg {
  z-index: -1;
  position: absolute;
  height: 30rem;
  width: 100%;
  left: 0;
  top: 0;
  /*background-size: cover; 必须放在background-position后面用 "/" 分割*/
  background: url('../../../assets/img/bgm.jpg') no-repeat center /cover;
  /* brightness()给图片应用一种线性乘法，使其看起来更亮或更暗。如果值是0%，图像会全黑。值是100%，
    则图像无变化。其他的值对应线性乘数效果。值超过100%也是可以的，图像会比原来更亮。如果没有设定值，默认是1。*/
  filter: brightness(0.7);
}

nav ul {
  display: flex;
  display: -webkit-flex;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  margin: 0;
  list-style: none;
}
</style>
