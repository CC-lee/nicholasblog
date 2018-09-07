<template src="./vfooter.html"></template>

<script>
export default {
}
</script>

<style lang="css" scoped>
  footer{
    height: 10rem;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
  }
  footer p{
    margin-left:0px;
    font-size: 1rem;
    color: #3d3d3d;
    padding: 0 1.5rem;
  }
  @media screen and (max-width:768px){
    footer{
      height: 6rem;
    }
  }
</style>
