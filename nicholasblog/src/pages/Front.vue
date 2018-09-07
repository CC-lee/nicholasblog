<template src="./Front.html"></template>

<script>
import vhead from "./components/vheader/vheader";
import vfoot from "./components/vfooter/vfooter";
import aboutme from "./components/aboutme/aboutme";
import updateinfo from "./components/updateinfo/updateinfo";
import music from "./components/music/music";
import backtop from "./components/backtop/backtop";
import backgroundBar from "./components/background/background";
import ls from "store2";
import Slick from "vue-slick";
import "vue-slick/node_modules/slick-carousel/slick/slick.css";
import execlib from "../lib/execlib";
export default {
  data() {
    return {
      items: [],
      loading2: false,
      backtopshow: false,
      slickOptions: {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: false,
        nextArrow: false,
        dots: false
      },
      filePrefix: execlib.filePrefix
    };
  },
  components: {
    vhead,
    vfoot,
    aboutme,
    updateinfo,
    music,
    backtop,
    backgroundBar,
    Slick
  },
  methods: {
    stickyNav() {
      var topNav = this.$refs.topNav;
      var limit = topNav.offsetTop;
      window.onscroll = function() {
        stickyFunction();
      };
      function stickyFunction() {
        if (window.pageYOffset >= limit) {
          if (screen.width >= 1024) {
            topNav.classList.add("sticky-nav1000");
          }
        } else {
          topNav.classList.remove("sticky-nav1000");
        }
      }
    },
    screenOrientation() {
      var topNav = this.$refs.topNav;
      window.addEventListener("orientationchange", function() {
        if (screen.width >= 1024) {
          topNav.classList.remove("sticky-nav1000");
        }
      });
    },
    screenResize() {
      var topNav = this.$refs.topNav;
      window.addEventListener("resize", function() {
        if (screen.width >= 1024) {
          topNav.classList.remove("sticky-nav1000");
        }
      });
    }
  },
  mounted() {
    this.stickyNav();
    this.screenOrientation();
  }
};
</script>

<style lang="scss" scoped>
@import "./Front.scss";
@media screen and (max-width: 480px) {
  .content {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>