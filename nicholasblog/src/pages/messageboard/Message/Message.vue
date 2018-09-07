<template src='./Message.html'></template>

<script>
import { mapGetters } from "vuex";
import api from "api";
import actions from "../../components/actions/actions";
import comments from "../../components/comments/comments";
import execlib from '../../../lib/execlib'
export default {
  data() {
    return {
      message: {
        create_date: "",
        like_status: ""
      },
      comments: [],
      image: false,
      images: ""
    };
  },
  components: {
    actions,
    comments
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile",
      position: "message/getposition",
      status: "message/getstatus"
    })
  },
  methods: {
    turn() {
      if (this.status === "search") {
        this.$store.commit("message/changestatus", "searchReturn");
      } else {
        this.$router.push("/messageboard");
      }
    },
    getOneMessage() {
      var id = this.$route.params.id;
      api.message
        .getOneMessage({ _id: id, user_id: this.profile._id })
        .then(result => {
          let { code, data } = result.data;
          Object.assign(this.message, data);
          document.title = `${this.message.user_name}留言-- Nicholas Lee's Blog`;
          if (this.message.img.length > 0) {
            if (this.message.message_type == "admin") {
              for (var i in this.message.img) {
                this.images =
                  this.images +
                  `<img src="${this.message.img[
                    i
                  ]}" style="padding:0 5px;flex:0 1 25%;height:200px;">`;
              }
              this.image = true;
            } else {
              for (var i in this.message.img) {
                this.images =
                  this.images +
                  `<img src="${this.message.img[
                    i
                  ]}" style="padding:0 5px;flex:0 1 25%;height:200px;">`;
              }
              this.image = true;
            }
          }
        })
        .catch(err => {
          alert(err.message);
        });
    },
    anchor() {
      $("#modal1").animate({ scrollTop: $("#comment").offset().top }, 1000);
      return false;
    },
    getcomments() {
      if (this.loggedIn) {
        api.message
          .getAllComments({
            message_id: this.$route.params.id,
            user_id: this.profile._id
          })
          .then(result => {
            this.comments = result.data.comments;
          });
      } else {
        api.message
          .getAllComments({ message_id: this.$route.params.id })
          .then(result => {
            this.comments = result.data.comments;
          });
      }
    },
    touchListen() {
      var that = this;
      var mouse_x;
      var mouse_y;
      this.$refs.whole.addEventListener("touchstart", function(event) {
        mouse_x = event.pageX;
        mouse_y = event.pageY;
      });
      this.$refs.whole.addEventListener("touchmove", function(event) {
        var new_mouse_x = event.pageX;
        if (new_mouse_x - mouse_x > 75) {
          //swiped right
        } else if (new_mouse_x - mouse_x < -75) {
          //swiped left
          that.$refs.modal.hide();
          setTimeout(function() {
            that.turn();
          }, 200);
        }
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
  activated() {},
  beforeCreate() {},
  created() {
    if (this.status !== "search") {
      this.$store.commit("message/changestatus", "message");
    }
    this.judgeLoad(this.getOneMessage);
    this.judgeLoad(this.getcomments);
  },
  mounted() {
    this.$refs.modal.show();
    this.touchListen();
    setTimeout(() => {
      $(".fr-emoticon-img").css({
        "background-repeat": "no-repeat !important",
        "font-size": "15px",
        height: "1em",
        width: "1em",
        "min-height": "20px",
        "min-width": "20px",
        display: "inline-block",
        margin: "-0.1em 0.1em 0.1em",
        "line-height": "1",
        "vertical-align": "middle"
      });
    }, 200);
    if (this.$route.hash) {
      setTimeout(() => {
        this.anchor();
      }, 0);
    }
  },
  watch: {
    profile: function() {
      this.judgeLoad(this.getOneMessage);
      this.judgeLoad(this.getcomments);
    }
  },
  beforeDestroy() {
    if (this.status !== "search") {
      this.$store.commit("message/changestatus", "board");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Message.scss";
</style>