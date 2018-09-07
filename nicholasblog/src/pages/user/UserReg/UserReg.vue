<template src="./UserReg.html"></template>
<script>
import api from "api";
import execlib from "../../../lib/execlib";
export default {
  data() {
    return {
      repeat: "",
      user: {
        email: "",
        user_name: "",
        password: "",
        gender: "",
        location: "",
        user_avatar: `${execlib.filePrefix}user/default/Kostya.jpg`,
        type: "register"
      }
    };
  },
  components: {},
  methods: {
    signup() {
      api.user
        .userRegister(this.user)
        .then(result => {
          let { data: { code, message } } = result;
          if (code == 200) {
            this.$router.push("/userLogin");
          }else{
            alert(message)
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
<style lang="scss" scoped>
@import "./UserReg.scss";
</style>