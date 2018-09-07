<template src="./updateinfo.html"></template>
<script>
var count = 0;
import api from "api";
import "./jquery.scrollbox.min";
export default {
  data() {
    return {
      page: 1,
      limit: 6,
      previews: []
    };
  },
  methods: {
    messagePreview(page, limit) {
      api.message.messagePreview({ page, limit }).then(result => {
        this.previews = result.data.preview;
      });
    },
    router(string){
      this.$router.push(`/messageboard/${string}`)
    }
  },
  mounted() {
    this.messagePreview(1, 6);
    $("#demo").scrollbox({
      linear: true,
      step: 1,
      delay: 0,
      speed: 100
    });
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
@import "./updateinfo.scss";
@import "../../../assets/css/frontend/public.css";
</style>