<template src='./Image.html'></template>

<script>
import { mapGetters } from "vuex";
import api from "api";
import actions from "../../components/actions/actions";
import comments from "../../components/comments/comments";
import execlib from 'execlib'
export default {
  data() {
    return {
      image: {
        create_date: "",
        image_content: "",
        like_status: ""
      },
      url: "",
      comments: []
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
  methods: {
    turn() {
      this.$router.push("/album");
    },
    getOneImage() {
      var id = this.$route.params.id;
      api.album
        .getOneImage({ _id: id, user_id: this.profile._id })
        .then(result => {
          let { code, data } = result.data;
          this.url = data.image_content.replace(/temp/gi, data._id);
          Object.assign(this.image, data);
        });
    },
    getcomments() {
      if (this.loggedIn) {
        api.album
          .getAllComments({
            image_id: this.$route.params.id,
            user_id: this.profile._id
          })
          .then(result => {
            this.comments = result.data.comments;
          });
      } else {
        api.album
          .getAllComments({ image_id: this.$route.params.id })
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
          that.$refs.imageModal.hide();
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
  beforeCreate() {
    this.$store.commit("album/changestatus", "image");
  },
  created() {
    this.judgeLoad(this.getOneImage);
    this.judgeLoad(this.getcomments);
  },
  mounted() {
    this.$refs.imageModal.show();
    this.touchListen();
  },
  watch: {
    profile: function() {
      this.judgeLoad(this.getOneImage);
      this.judgeLoad(this.getcomments);
    }
  },
  beforeDestroy() {
    this.$store.commit("album/changestatus", "album");
  }
};
</script>

<style lang="scss" scoped>
@import "./Image.scss";
</style>