<template src="./UserNotify.html"></template>

<script>
import { mapGetters } from "vuex";
import usernav from "../components/usernav/usernav";
import api from "api";
import * as _ from "lodash";
export default {
  data() {
    return {
      notifies: []
    };
  },
  components: {
    usernav
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      profile: "global/getProfile"
    })
  },
  methods: {
    router(string) {
      this.$router.push(string);
    },
    notifyList() {
      api.user
        .getNotifyList({ _id: this.profile._id })
        .then(result => {
          let { data: { code, data } } = result;
          this.notifies = data;
        })
        .catch(err => {
          alert(err.message);
        });
    },
    clearunread() {
      api.user
        .deleteUnRead({ _id: this.profile._id })
        .then(result => {
          let { data: { code } } = result;
          if (code === 200) {
            this.$store.commit("global/clearNum");
          }
        })
        .catch(err => {
          alert(err.message);
        });
    },
    deleteNotify(id) {
      if (confirm("是否删除该通知？") == true) {
        const index = _.findIndex(this.notifies, { _id: id });
        api.user
          .deleteOneNotify({ _id: id })
          .then(result => {
            let { data: { code } } = result;
            if (code === 200) {
              this.notifies.splice(index, 1);
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    }
  },
  beforeCreate() {},
  mounted() {
    this.$store.commit("user/setactive", "userNotify");
    document.title = `${this.profile.user_name}用户通知-- Nicholas Lee's Blog`;
    this.clearunread();
    this.notifyList();
  },
  beforeDestroy() {
    this.$store.commit("user/unactive");
  }
};
</script>

<style lang="scss" scoped>
@import "./UserNotify.scss";
</style>