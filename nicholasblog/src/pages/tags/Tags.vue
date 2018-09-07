<template src="./Tags.html"></template>

<script>
import aboutme from "../components/aboutme/aboutme";
import updateinfo from "../components/updateinfo/updateinfo";
import articlesl from "../home/ArticleShowList/ArticleShowList";
import api from "api";
import { mapGetters } from "vuex";
import tagslib from "./tagslib";
import * as _ from "lodash";
import Autocomplete from "./lib/v-autocomplete";
import "./lib/v-autocomplete/dist/v-autocomplete.css";
import ItemTemplate from "./ItemTemplate.vue";
export default {
  data() {
    return {
      itemsStore: [],
      items: [],
      articleLists: [],
      selected: -1,
      show: true,
      loading2: true,
      list_show: true,
      searchKey: "",
      template: ItemTemplate,
      completeitem: null,
      completeitems: [],
      searchButtonActive: true,
      classify: "",
      loadMoreShow: false,
      page: 1,
      limit: 6
    };
  },
  components: {
    aboutme,
    updateinfo,
    articlesl,
    "v-autocomplete": Autocomplete
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile"
    })
  },
  methods: {
    menu() {
      if (this.$route.name === "tagsarticles") {
        this.scrollHeight = document.body.scrollHeight;
        this.offsetHeight = document.body.offsetHeight;
        this.scrollTop = $(document).scrollTop();
        this.scroll = this.scrollTop + this.offsetHeight;
        if (this.loadMoreShow === true) {
          if (this.scroll >= this.scrollHeight - 200) {
            this.loadMoreShow = false;
            this.getPage(this.classify, this.page, this.limit);
          }
        }
      }
    },
    inputUpdate(item, text, event) {
      var that = this;
      if (event && event.inputType === "deleteContentBackward") {
      }

      if (!item && !this.completeitem) {
        this.completeitems = this.itemsStore;
      }
    },
    focusFun(text) {
      if (!this.completeitem) {
        this.completeitems = this.itemsStore;
      } else if (this.completeitem && !this.completeitem.classify) {
        this.completeitems = this.itemsStore;
      }
    },
    blurFun(text) {},
    getLabel(item) {
      if (item) {
        this.searchKey = item.classify;
        return item.classify;
      }
    },
    updateItems(text) {
      if (text) {
        this.completeitems = this.itemsStore.filter(item => {
          return new RegExp(text.toLowerCase()).test(
            item.classify.toLowerCase()
          );
        });
      } else {
        this.completeitems = this.itemsStore;
      }
    },
    loadAll() {
      var fn = tagslib.classList;
      var that = this;
      var args = arguments;
      this.$emit("execute", fn, args, that);
    },
    gets(index, classify) {
      var that = this;
      var args = arguments;
      var fn = function(index, classify) {
        this.show = false;
        this.selected = index;
      };
      this.$emit("execute", fn, args, that);
    },
    getPage(classify, page, limit) {
      if (this.loggedIn) {
        var fn = tagslib.loadArticleLoggin;
        var that = this;
        var args = arguments;
        this.$emit("execute", fn, args, that);
      } else {
        var fn = tagslib.loadArticleUnloggin;
        var that = this;
        var args = arguments;
        this.$emit("execute", fn, args, that);
      }
    },
    getClassBySearch() {
      var that = this;
      setTimeout(function() {
        var key = that.$refs.autocomplete.searchText.replace(
          /(\s|&nbsp;|<p.*?>|<\/p>)/g,
          ""
        );
        if (key) {
          this.searchButtonActive = false;
          if (that.completeitem && that.completeitem.classify) {
            that.$router.push(`/search/tags/${that.completeitem.classify}`);
            // that.loadSearch(that.completeitem.classify);
            this.searchButtonActive = true;
          } else {
            that.$router.push(`/search/tags/${key}`);
            // that.loadSearch(key);
            // that.$refs.autocomplete.searchText = key;
            this.searchButtonActive = true;
          }
        }
      }, 500);
    },
    loadSearch(key) {
      var fn = tagslib.specificClassList;
      var that = this;
      var args = arguments;
      this.$emit("execute", fn, args, that);
    }
  },
  beforeCreate() {
    tagslib.on.apply(this);
  },
  created() {
    this.loadAll();
    if (this.$route.name === "tagsearch") {
      document.title = `${this.$route.params
        .text} - 标签搜索-- Nicholas Lee's Blog`;
      this.loadSearch(this.$route.params.text);
      this.$nextTick(function() {
        this.$refs.autocomplete.searchText = this.$route.params.text;
      });
    }
    this.$watchAsObservable("$route").subscribe(x => {
      //console.log(x);
    });
  },
  mounted() {
    // 根据标签名获取文章列表
    window.addEventListener("scroll", this.menu);
  },
  watch: {
    itemsStore: function() {
      if (this.$route.name === "tagsarticles" && this.itemsStore.length > 0) {
        var item = _.find(this.itemsStore, { _id: this.$route.params.id });
        if (item) {
          var index = _.findIndex(this.itemsStore, {
            _id: this.$route.params.id
          });
          this.selected = index;
          document.title = `${item.classify} 类文章-- Nicholas Lee's Blog`;
          if (item) {
            this.classify = item.classify;
            this.getPage(item.classify, 1, this.limit);
          }
        } else {
          alert("该分类不存在");
        }
      }
    },
    "$route.path": function() {
      if (this.$route.name === "tags") {
        this.loadAll();
        this.articleLists = [];
        this.selected = -1;
      }
      if (this.$route.name === "tagsarticles") {
        this.page = 1;
        this.classify = "";
        this.articleLists = [];
        this.show = false;
        var item = _.find(this.items, { _id: this.$route.params.id });
        var index = _.findIndex(this.items, { _id: this.$route.params.id });
        this.selected = index;
        document.title = `${item.classify} 类文章-- Nicholas Lee's Blog`;
        if (item) {
          this.classify = item.classify;
          this.getPage(item.classify, 1, this.limit);
        }
      }
      if (this.$route.name === "tagsearch") {
        document.title = `${this.$route.params
          .text} - 标签搜索-- Nicholas Lee's Blog`;
        this.selected = -1;
        this.articleLists = [];
        this.loadSearch(this.$route.params.text);
        this.$refs.autocomplete.searchText = this.$route.params.text;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.menu);
  }
};
</script>

<style lang="scss" scoped>
@import "./Tags.scss";
</style>