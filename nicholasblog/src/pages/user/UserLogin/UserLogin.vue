<template src="./UserLogin.html"></template>
<script>
import api from "api";
import execlib from '../../../lib/execlib'
export default {
  data() {
    return {
      keepstatus: false,
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      api.user
        .userLogin(this.user)
        .then(result => {
          let { data: { code, token, profile } } = result;
          if (token && profile) {
            if (this.keepstatus == true) {
              localStorage.setItem(execlib.tokenName, token);
              location.replace(execlib.hostFrontMainPath);
            } else {
              this.$store.commit("global/save", {
                profile: profile,
                token: token
              });
              this.$router.push("/");
            }
          } else {
            alert("登录错误");
          }
        })
        .catch(err => {
          alert(err.message);
        });
    }
  },
  mounted() {}
};
</script>
<style  lang="scss" scoped>
@import "./UserLogin.scss";
</style>