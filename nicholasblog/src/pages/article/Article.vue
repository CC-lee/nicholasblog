<template src="./Article.html"></template>
<script>
import api from "api";
import actions from "../components/actions/actions";
import comments from "../components/comments/comments";
import { mapGetters } from "vuex";
import execlib from 'execlib'
export default {
  data() {
    return {
      oneArticle: {
        title: "",
        create_date: "",
        content: "",
        like_status: ""
      },
      comments: [],
      loading2: true,
      type: "article",
      kind: "main",
      hash:null,
    };
  },
  components: {
    actions,
    comments
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile"
    })
  },
  created() {
    // 在这里调用获取一篇文章的api
    this.judgeLoad(this.loadArticle);
    this.judgeLoad(this.loadComments);
    if (this.$route.hash) {
       this.hash = this.$route.hash
     }
  },
  methods: {
    anchor(hash) {
      if($(hash).length){
        $("html,body").animate({ scrollTop: $(hash).offset().top }, 1000);
        return false;
      }
    },
    loadArticle() {
      api.article
        .getOneArticle({
          article_id: this.$route.params.id,
          user_id: this.profile._id
        })
        .then(({ data: { code, data } }) => {
          if (code === 200) {
            setTimeout(() => {
              this.loading2 = false;
              Object.assign(this.oneArticle, data);
              document.title = `${this.oneArticle.title}-- Nicholas Lee's Blog`;
            }, 200);
          }
        });
    },
    loadComments() {
      api.article
        .getAllComments({
          article_id: this.$route.params.id,
          user_id: this.profile._id
        })
        .then(result => {
          this.comments = result.data.comments;
        });
    },
    judgeLoad(fn) {
      if (localStorage.getItem(execlib.tokenName)) {
        if (this.profile._id) {
          fn();
        }
      } else {
        fn();
      }
    }
  },
  mounted() {
  },
  updated: function () {
    var that = this
    this.$nextTick(function () {
      that.anchor(that.hash);
    })
  },
  watch: {
    profile: function() {
      this.judgeLoad(this.loadArticle);
      this.judgeLoad(this.loadComments);
    }
  },
  beforeDestroy() {
   
  }
};
</script>
<style lang="scss"  src="./Article.scss">
</style>
