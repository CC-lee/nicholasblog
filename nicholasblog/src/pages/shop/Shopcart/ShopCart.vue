<template src="./ShopCart.html"></template>

<script>
import { mapGetters } from "vuex";
import api from "api";
import usernav from "../../user/components/usernav/usernav";
import * as _ from "lodash";
export default {
  data() {
    return {
      carts: [],
      total: 0
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
    userShopCart() {
      api.shop.userShopCart({ user_id: this.profile._id }).then(result => {
        this.carts = result.data.data;
        for (var i = 0; i < this.carts.length; i++) {
          this.total =
            this.total + this.carts[i].quantity * this.carts[i].unit_price;
        }
      });
    },
    deleteCartInfo(cart) {
      if (confirm("是否删除购物车商品？") == true) {
        api.shop
          .deleteCartInfo({ _id: cart._id })
          .then(result => {
            if (result.data.code == 200) {
              const index = _.findIndex(this.carts, { _id: cart._id });
              this.carts.splice(index, 1);
              var total = 0;
              for (var i = 0; i < this.carts.length; i++) {
                total =
                  total + this.carts[i].quantity * this.carts[i].unit_price;
              }
              this.total = total;
            } else {
              alert("后台错误");
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    },
    count(cart) {
      if (cart.quantity == 0) {
        cart.quantity = 1;
      }
      var total = 0;
      for (var i = 0; i < this.carts.length; i++) {
        total = total + this.carts[i].quantity * this.carts[i].unit_price;
      }
      this.total = total;
      cart.price = cart.quantity * cart.unit_price;
    },
    router(string) {
      this.$router.push(`/shop/${string}`);
    },
    check(cart) {
      var total = 0;
      for (var i = 0; i < this.carts.length; i++) {
        total = total + this.carts[i].quantity * this.carts[i].unit_price;
      }
      this.total = total;
      cart.price = cart.quantity * cart.unit_price;
    },
    createOrder() {
      var order = {
        user_id: this.profile._id,
        user_name: this.profile.user_name,
        item_list: this.carts,
        total_price: this.total
      };
      api.shop.createOrder(order).then(result => {
        if (result.data.code == 200) {
          this.$router.push(`/user/${this.profile._id}/userOrderList`)
        }
      });
    }
  },
  watch: {
    profile:function(){
      if(this.carts.length===0){
        this.userShopCart();
      }
    }
  },
  mounted() {
    this.$store.commit("user/setactive", "shopCart");
    this.userShopCart();
    document.title = `${this.profile.user_name}购物车-- Nicholas Lee's Blog`;
  },
  beforeDestroy() {
    this.$store.commit("user/unactive");
  }
};
</script>

<style  lang="scss" scoped>
@import "./ShopCart.scss";
</style>