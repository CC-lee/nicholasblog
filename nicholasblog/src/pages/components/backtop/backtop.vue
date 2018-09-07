<template src="./backtop.html"></template>
<script>
export default {
  methods: {
    top() {
      $('body,html').animate({
        scrollTop: '0px'
      }, 300)
    },
    check() {
      if ($(document).scrollTop() > 300) {
        $('#top').fadeIn()
      } else {
        $('#top').fadeOut()
      }
    }
  },
  mounted() {
    this.top()
    window.addEventListener('scroll', this.check)
  }
}
</script>
<style lang="scss" scoped>
@import './backtop.scss';
</style>
<style lang="css" scoped>
.location {
  position: fixed;
  right: 50px;
  bottom: 30px;
  width: 20px;
  padding: 5px;
  cursor: pointer;
  color: #003;
  display: none;
}
</style>