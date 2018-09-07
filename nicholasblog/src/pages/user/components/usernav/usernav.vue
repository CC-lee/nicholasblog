<template src="./usernav.html"></template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      active: "user/getactive",
      profile: "global/getProfile",
      message: "global/getMessage"
    })
  },
  methods: {
    router(string) {
      this.$router.push(`/user/${this.profile._id}/${string}`);
    }
  },
  mounted() {
  },
  watch: {
    active: function() {
      $(`#${this.active}`).addClass("active");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./usernav.scss";
</style>