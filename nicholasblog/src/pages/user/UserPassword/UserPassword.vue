<template src="./UserPassword.html"></template>

<script>
import usernav from "../components/usernav/usernav";
import { mapGetters } from "vuex";
import api from "api";
import execlib from '../../../lib/execlib'
export default {
  data() {
    return {
      password: "",
      repeatPassword: ""
    };
  },
  components: {
    usernav
  },
  computed: {
    ...mapGetters({
      token: "global/getToken",
      profile: "global/getProfile"
    })
  },
  methods: {
    update() {
      if (this.password.length == 0) {
        alert("密码不能为空");
      } else if (this.password.length < 5) {
        alert("密码不小于5位");
      } else if (this.password != this.repeatPassword) {
        alert("密码不一致");
      } else {
        api.user
          .modifyUserPassword({
            _id: this.profile._id,
            email: this.profile.email,
            user_name: this.profile.user_name,
            password: this.password
          })
          .then(result => {
            let { data: { code, token, message } } = result;
            if (code == 200) {
              if (localStorage.getItem(execlib.tokenName)) {
                localStorage.setItem(execlib.tokenName, token);
              }
              this.$store.commit("global/changeToken", token);
              alert(message);
              this.$router.push("/home");
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    },
    cancel() {
      this.$router.push("/home");
    }
  },
  mounted() {
    this.$store.commit("user/setactive", "userPassword");
    document.title = `${this.profile.user_name}修改密码-- Nicholas Lee's Blog`;
  },
  beforeDestroy() {
    this.$store.commit("user/unactive");
  }
};
</script>
<style  lang="scss" scoped>
@import "./UserPassword.scss";
</style>