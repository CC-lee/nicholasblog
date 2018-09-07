<template src="./ArticleShowList.html"></template>
<script>
import actions from "../../components/actions/actions";

class ShowList {
  constructor({ article_id, classify, title, article_preview, theme_img }) {
    this.item = {
      article_id,
      classify,
      title,
      article_preview,
      theme_img
    };
  }
  show() {
    return this.item;
  }
}

export default {
  data() {
    return {
      article_id: "",
      classify: "",
      title: "",
      article_preview: "",
      theme_img: "",
      type: "article",
      kind: "preview",
      enterPage: false
    };
  },
  props: ["item"],
  components: {
    actions
  },
  methods: {
    show() {
      if (this.item) {
        var shower = new ShowList(this.item);
        Object.assign(this, shower.show());
      }
    },
    router(string) {
      this.$router.push(string);
    },
    touchEnter() {
      this.enterPage = true;
    },
    cancelEnter() {
      this.enterPage = false;
    },
    touchRouter(string) {
      if (this.enterPage === true) {
        this.$router.push(string);
        this.enterPage = false;
      }
    }
  },
  mounted() {
    this.show();
  }
};
</script>
<style lang="scss" scoped>
@import "./ArticleShowList.scss";
</style>
