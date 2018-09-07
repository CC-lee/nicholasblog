<template src="./music.html"></template>
<script>
export default {
  data() {
    return {
      link: ""
    };
  },
  methods: {
    music: function() {
      if (screen.availWidth < 736) {
        this.link =
          "//music.163.com/outchain/player?type=2&id=25638767&auto=1&height=32";
      } else {
        this.link =
          "//music.163.com/outchain/player?type=2&id=25638767&auto=1&height=430";
      }
    },
    size: function() {
      if (screen.availWidth < 736) {
        this.link =
          "//music.163.com/outchain/player?type=2&id=25638767&auto=1&height=32";
      } else {
        this.link =
          "//music.163.com/outchain/player?type=2&id=25638767&auto=1&height=430";
      }
    }
  },
  mounted() {
    this.music();
    window.addEventListener("resize", this.size);
  },
    beforeDestroy() {
    window.removeEventListener("resize", this.size);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/frontend/public.css";
@import './music.scss';
</style>