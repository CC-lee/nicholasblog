<template src="./Item.html"></template>

<script>
import { mapGetters } from 'vuex'
import api from 'api'
import 'flexslider/jquery.flexslider.js'
import 'flexslider/flexslider.css'
import * as _ from 'lodash'
export default {
  data() {
    return {
      item: {
        item_detail: '',
        item_name: '',
        item_img: [],
        item_option: {}
      },
      itemhtml: '',
      selects: 0,
      number: 10,
      selected: [],
      selectarray: {},
      quantity: 1
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'global/getLog',
      profile: 'global/getProfile'
    })
  },
  filters: {
    kindOptionFun: function(option, setting) {
      switch (setting) {
        case 'name':
          return option.kindOption.name
          break
        case 'kind':
          return option.kindOption.kind
      }
    }
  },
  methods: {
    getOneItem(id) {
      api.shop.getOneItem({ _id: id }).then(result => {
        this.item = result.data.data
        document.title = `${this.item.item_name}-- Nicholas Lee's Blog`
        this.selects = this.item.item_option.length
        for (var i = 0; i < this.selects; i++) {
          this.selectarray[`array${i}`] = []
        }
      })
    },
    shopCartInfo() {
      if (this.loggedIn) {
        if (this.selected.length < this.selects) {
          alert('选项勾选不齐全')
          $('.item-select').css({ border: '1px solid red' })
        } else {
          this.selected = _.sortBy(this.selected, ['num'])
          var cartInfo = {
            user_id: this.profile._id,
            item_id: this.item._id,
            item_img: this.item.item_img[0],
            item_name: this.item.item_name,
            unit_price: this.item.unit_price,
            quantity: this.quantity,
            price: this.item.unit_price * this.quantity,
            item_option: this.selected
          }
          api.shop.shopCartInfo(cartInfo).then(result => {
            //console.log(result)
          })
          this.$refs.cartmodal.show()
        }
      } else {
        this.$router.push('/userLogin')
      }
    },
    get(event, array, number, name) {
      if (this.selectarray[array].length == 1) {
        this.selectarray[array].splice(0, 1)
      }
      if (event.target.value) {
        if (event.target.checked) {
          const index = _.findIndex(this.selected, { name: name })
          if (index > -1) {
            this.selected.splice(index, 1)
            this.selected.push({
              num: number,
              id: event.target.id,
              name: name,
              value: event.target.value
            })
          } else {
            const index = _.findIndex(this.selected, {
              name: name
            })
            if (index > -1) {
              this.selected.splice(index, 1)
            } else {
              this.selected.push({
                num: number,
                id: event.target.id,
                name: name,
                value: event.target.value
              })
            }
          }
        } else {
          const index = _.findIndex(this.selected, { name: name })
          this.selected.splice(index, 1)
        }
      }
    },
    plus() {
      this.quantity++
    },
    minus() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    router(string) {
      this.$router.push(string)
    }
  },
  created() {
    this.getOneItem(this.$route.params.id)
  },
  mounted() {},
  watch: {
    item: function() {
      const that = this
      var itemhtmlCompose = ''
      if (this.item.item_img.length > 0) {
        for (var i = 0; i < this.item.item_img.length; i++) {
          itemhtmlCompose += `
        <li data-thumb="${this.item.item_img[i]}">
          <div class="thumb-image">
            <img src="${this.item.item_img[i]}" alt=" " class="img"/>
          </div>
        </li>`
        }
        this.itemhtml = `
     <div id="flexSlider" class="flexslider">
      <ul class="slides">
      ${itemhtmlCompose}
      </ul>
    </div>  
        `
        // 视图更新为异步
        setTimeout(function() {
          $('#flexSlider').flexslider({
            animation: 'slide',
            slideshow: 'false',
            controlNav: 'thumbnails'
          })
          $('.flex-prev').css({ display: 'none' })
          $('.flex-next').css({ display: 'none' })
          $('.item-left .img').css({ height: '40vh' })
          $('.flex-control-nav img').css({ height: '100px' })
        }, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Item.scss';
</style>