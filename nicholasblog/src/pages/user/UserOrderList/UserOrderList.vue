<template src="./UserOrderList.html"></template>

<script>
import usernav from "../components/usernav/usernav";
import { mapGetters } from "vuex";
import api from "api";
import * as _ from "lodash";
export default {
  data() {
    return {
      orderlist: [],
      list: [],
      fields: [
        { key: "date", label: "日期", class: "small" },
        { key: "total", label: "总价", class: "small" },
        { key: "actions", label: "操作", class: "small" }
      ]
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
    getOrderList() {
      api.user.getOrderList({ user_id: this.profile._id }).then(result => {
        this.orderlist = JSON.parse(JSON.stringify(result.data.data));
        for (var i = 0; i < this.orderlist.length; i++) {
          var info = {
            date: this.orderlist[i].create_date,
            total: `$${this.orderlist[i].total_price}`,
            _id: this.orderlist[i]._id
          };
          this.list.push(info);
        }
      });
    },
    router(string) {
      this.$router.push(`/user/${this.profile._id}/userOrderList/${string}`);
    },
    deleteOneOrder(id) {
      if (confirm("是否删除订单？") == true) {
        api.user
          .deleteOneOrder({ _id: id })
          .then(result => {
            if (result.data.code == 200) {
              const index = _.findIndex(this.list, { _id: id });
              this.list.splice(index, 1);
            } else {
              alert("后台错误");
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    }
  },
  mounted() {
    this.getOrderList();
    this.$store.commit("user/setactive", "userOrderList");
    document.title = `${this.profile.user_name}购物订单-- Nicholas Lee's Blog`;
  },
  beforeDestroy() {
    this.$store.commit("user/unactive");
  }
};
</script>

<style  lang="scss" scoped>
@import "./UserOrderList.scss";
</style>