<template src="./UserOrder.html"></template>


<script>
import api from "api";
import { mapGetters } from "vuex";
import usernav from "../components/usernav/usernav";
export default {
  data() {
    return {
      lists: [],
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
    /**
     * @param {string} id
     */
    getOneOrder(id) {
      api.user.getOneOrder({ _id: id }).then(result => {
        this.lists = result.data.data.item_list;
        this.total = result.data.data.total_price;
      });
    },
    /**
     * @param {string} string 
     */
    router(string) {
      this.$router.push(`/shop/${string}`);
    }
  },
  mounted() {
    this.getOneOrder(this.$route.params.orderId);
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "./UserOrder.scss";
</style>