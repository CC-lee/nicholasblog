<template src="./Messageboard.html"></template>
<script>
import api from "api";
import aboutme from "../../components/aboutme/aboutme";
import updateinfo from "../../components/updateinfo/updateinfo";
import messagesl from "../components/MessageShowList/MessageShowList";
import actions from "../../components/actions/actions";
import execlib from "../../../lib/execlib";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showlist: false,
      items: [],
      loadMoreShow: false,
      loadMoreSearch: false,
      page: 1,
      limit: 6,
      scroll: "",
      scrollHeight: "",
      offsetHeight: "",
      scrollTop: "",
      searchPath: "",
      key: []
    };
  },
  components: {
    aboutme,
    updateinfo,
    messagesl,
    actions
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile",
      status: "message/getstatus",
      searchOn: "message/getSearch"
    })
  },
  methods: {
    message() {
      this.$store.commit("global/checkMessage");
    },
    menu() {
      this.scrollHeight = document.body.scrollHeight;
      this.offsetHeight = document.body.offsetHeight;
      this.scrollTop = $(document).scrollTop();
      this.scroll = this.scrollTop + this.offsetHeight;
      if (this.loadMoreShow === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreShow = false;
          this.getmessages(this.page, this.limit);
        }
      }
      if (this.loadMoreSearch === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreText = "加载中";
          this.loadMoreSearch = false;
          this.getMessageSearch(this.page, this.limit, this.key);
        }
      }
    },
    getmessages(page, limit) {
      api.message
        .messageList({ page, limit, user_id: this.profile._id })
        .then(result => {
          let { code, messages, hasNext } = result.data;
          if (code === 200) {
            setTimeout(() => {
              this.items = this.items.concat(messages);
              this.showlist = true;
              if (hasNext) {
                this.loadMoreShow = true;
                this.page++;
              } else {
                this.loadMoreShow = false;
              }
            }, 200);
          }
        })
        .catch(err => {
          alert(err.message);
        });
    },
    getMessageSearch(page, limit, keyArray) {
      return api.message
        .getMessagesBySearch({ page, limit, key: keyArray })
        .then(result => {
          let { code, messages, hasNext } = result.data;
          if (code === 200) {
            setTimeout(() => {
              this.items = this.items.concat(messages);
              this.showlist = true;
              if (hasNext) {
                this.loadMoreSearch = true;
                this.page++;
              } else {
                this.loadMoreSearch = false;
              }
            }, 200);
          }
        });
    },
    reset() {
      if (this.$route.name === "messagesearch") {
        this.page = 1;
        document.title = `${this.$route.params
          .text} - 留言搜索-- Nicholas Lee's Blog`;
        var keys = this.$route.params.text.split(" "),
          keyArray = [];
        for (var i = 0, len = keys.length; i < len; i++) {
          keyArray.push({ content: { $regex: keys[i], $options: "igm" } });
        }
        this.searchPath = this.$route.path;
        this.$store.commit("message/changestatus", "search");
        this.items = [];
        this.loadMoreShow = false;
        return keyArray;
      } else {
        this.$store.commit("message/changestatus", "board");
        this.searchPath = "";
        this.items = [];
        this.page = 1;
        this.loadMoreSearch = false;
      }
    },
    judgeLoad(page, limit) {
      if (localStorage.getItem(execlib.tokenName)) {
        if (this.profile._id) {
          if (
            this.$route.name === "messagesearch" &&
            this.status !== "search"
          ) {
            this.key = this.key.concat(this.reset());
            this.getMessageSearch(page, limit, this.key);
          } else {
            if (this.status === "board") {
              this.getmessages(page, limit);
            }
          }
        }
      } else {
        if (this.$route.name === "messagesearch" && this.status !== "search") {
          this.key = this.key.concat(this.reset());
          this.getMessageSearch(page, limit, this.key);
        } else {
          if (this.status === "board") {
            this.getmessages(page, limit);
          }
        }
      }
    },
    change(event) {
      if (event.keyCode == 13) {
        this.keyCode = 13;
      }
    }
  },
  mounted() {
    this.message();
    this.judgeLoad(1, 6);
    window.addEventListener("scroll", this.menu);
  },
  watch: {
    status: function() {
      if (this.status == "board" && this.items.length == 0) {
        this.getmessages(1, 6);
      }
      if (this.status === "searchReturn") {
        this.$store.commit("message/changestatus", "search");
        this.$router.replace(this.searchPath);
      }
    },
    "$route.path": function() {
      if (this.$route.name === "messagesearch" && this.status !== "search") {
        this.key = this.key.concat(this.reset());
        this.getMessageSearch(1, 6, this.key);
      } else {
        if (this.$route.name === "messageboard" && this.status === "search") {
          this.reset();
        }
      }
    },
    searchOn: function() {
      if (this.searchOn) {
        if (this.status === "search") {
          this.key = this.key.concat(this.reset());
          this.getMessageSearch(1, 6, this.key);
        }
      }
    },
    profile: function() {
      this.judgeLoad(1, 6);
    }
  },
  beforeDestroy() {
    this.$store.commit("global/unMessage");
    this.$store.commit("message/changestatus", "board");
    window.removeEventListener("scroll", this.menu);
  }
};
</script>
<style lang="scss" scoped>
@import "./Messageboard.scss";
</style>