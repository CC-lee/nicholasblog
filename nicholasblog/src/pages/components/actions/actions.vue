<template src="./actions.html"></template>
<script>
import { mapGetters } from "vuex";
import api from "api";
class article {
  constructor(item) {
    let { article_id, like_status } = item;
    this.article_id = article_id;
  }
  act() {
    if (this.article_id) {
      return {
        link: { path: `/article/${this.article_id}#comment` }
      };
    }
  }
}
class message {
  constructor(item) {
    let { _id } = item;
    this._id = _id;
  }
  act() {
    return {
      link: { path: `/messageboard/${this._id}#comment` }
    };
  }
}
class album {
  constructor(item) {
    let { image_id } = item;
    this.image_id = image_id;
  }
  act() {
    if (this.image_id) {
      return {
        link: { path: `/album/${this.image_id}` }
      };
    }
  }
}
export default {
  data() {
    return {
      actions: {
        link: {},
        like: {}
      },
      search: true
    };
  },
  props: ["item", "type", "kind"],
  methods: {
    generate() {
      if (this.type == "article") {
        var actor = new article(this.item);
        Object.assign(this.actions, actor.act());
        if (this.kind == "main") {
          $(".blog-info").css({ "font-size": "1em" });
        }
      }
      if (this.type == "message") {
        var actor = new message(this.item);
        Object.assign(this.actions, actor.act());
        if (this.kind == "main") {
          $("#message .blog-info").css({
            "font-size": "1em",
            "border-top": "none"
          });
        }
      }
      if (this.type == "image") {
        var actor = new album(this.item);
        Object.assign(this.actions, actor.act());
        if (this.kind == "main") {
          $(".blog-info").css({ "font-size": "1em" });
        }
      }
    },
    canclelike(id) {
      if (this.type == "image") {
        api[`album`]
          [`${this.type}LikeCancel`]({
            [`${this.type}_id`]: id,
            user_id: this.profile._id
          })
          .then(result => {
            let { code } = result.data;
            if (code == 200) {
              this.item.like_status = false;
              this.item.like_num--;
            }
            if (code == 201) {
              this.item.like_status = false;
              this.item.like_num--;
            }
          });
      } else {
        api[`${this.type}`]
          [`${this.type}LikeCancel`]({
            [`${this.type}_id`]: id,
            user_id: this.profile._id
          })
          .then(result => {
            let { code } = result.data;
            if (code == 200) {
              this.item.like_status = false;
              this.item.like_num--;
            }
            if (code == 201) {
              this.item.like_status = false;
              this.item.like_num--;
            }
          });
      }
    },
    sendlike(like) {
      if (this.type == "image") {
        api[`album`][`${this.type}Like`](like).then(result => {
          let { code } = result.data;
          if (code == 200) {
            this.item.like_status = true;
            this.item.like_num++;
          }
          if (code == 201) {
            this.item.like_status = true;
            this.item.like_num++;
          }
        });
      } else {
        api[`${this.type}`][`${this.type}Like`](like).then(result => {
          let { code } = result.data;
          if (code == 200) {
            this.item.like_status = true;
            this.item.like_num++;
          }
          if (code == 201) {
            this.item.like_status = true;
            this.item.like_num++;
          }
        });
      }
    },
    like() {
      if (this.loggedIn) {
        if (this.item.like_status == true) {
          if (this.kind == "main") {
            var id = this.item._id;
            this.canclelike(id);
          } else {
            if (this.type == "message") {
              var id = this.item[`_id`];
              this.canclelike(id);
            } else {
              var id = this.item[`${this.type}_id`];
              this.canclelike(id);
            }
          }
        } else {
          if (this.kind == "main") {
            var like = {
              [`${this.type}_id`]: this.item._id,
              user_id: this.profile._id,
              like_type: `${this.type}`
            };
            this.sendlike(like);
          } else {
            if (this.type == "message") {
              var like = {
                [`${this.type}_id`]: this.item[`_id`],
                user_id: this.profile._id,
                like_type: `${this.type}`
              };
              this.sendlike(like);
            } else {
              var like = {
                [`${this.type}_id`]: this.item[`${this.type}_id`],
                user_id: this.profile._id,
                like_type: `${this.type}`
              };
              this.sendlike(like);
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile"
    })
  },
  mounted() {
    if (this.$route.name === "articlesearch") {
      this.search = false;
    } else if (this.$route.name === "messagesearch") {
      this.search = false;
    }
    this.generate();
  }
};
</script>
<style lang="scss" scoped>
@import "./actions.scss";
</style>


