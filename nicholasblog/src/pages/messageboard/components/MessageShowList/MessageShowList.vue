<template src='./MessageShowList.html'></template>

<script>
import 'froala-editor/js/froala_editor.pkgd.min'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'font-awesome/css/font-awesome.css'
import 'froala-editor/css/froala_style.min.css'
import actions from '../../../components/actions/actions'

export default {
  data() {
    return {
      image: false,
      images: ''
    }
  },
  props: ['item'],
  components: {
    actions
  },
  methods: {
    show() {},
    router(string) {
      this.$store.commit('message/saveposition', $(document).scrollTop())
      this.$router.push(`/messageboard/${string}`)
    }
  },
  mounted() {
    this.show()
    $('.show p').css({ 'margin-bottom': '5px' })
    $('.show .fr-emoticon-img').css({
      'background-repeat': 'no-repeat !important',
      'font-size': '15px',
      height: '1em',
      width: '1em',
      'min-height': '20px',
      'min-width': '20px',
      display: 'inline-block',
      margin: '-0.1em 0.1em 0.1em',
      'line-height': '15px',
      'vertical-align': 'middle'
    })
    if (this.item.img.length > 0) {
      if (this.item.message_type == 'admin') {
        for (var i = 0; i < this.item.img.length; i++) {
          this.images =
            this.images +
            `<img src="${this.item.img[
              i
            ]}"  height="100" width="25%" style="padding:0 5px;">`
        }
        this.image = true
      } else {
        for (var i = 0; i < this.item.img.length; i++) {
          this.images =
            this.images +
            `<img src="${this.item.img[
              i
            ]}" height="100" width="25%" style="padding:0 5px;">`
        }
        this.image = true
      }
    }
  },
  watch: {
    '$route.path': function() {
      if (
        this.$route.path.search('messageboard') &&
        this.$route.hash === '#comment'
      ) {
        this.$store.commit('message/saveposition', $(document).scrollTop())
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('message/saveposition', 0)
  }
}
</script>

<style lang="scss" scoped>
@import './MessageShowList.scss';
</style>