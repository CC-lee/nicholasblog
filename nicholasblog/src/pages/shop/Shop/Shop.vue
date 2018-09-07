<template src="./Shop.html"></template>
<script>
import api from 'api'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { of } from 'rxjs/observable/of'
import * as _ from 'lodash'
import { mapGetters } from 'vuex'
import {
  map,
  startWith,
  scan,
  concatMap,
  toArray,
  first,
  take,
  last,
  toPromise,
  auditTime
} from 'rxjs/operators'
import execlib from 'execlib'
export default {
  data() {
    return {
      wrap: { items: [] },
      items: [],
      items$: null,
      loadDataSub: null,
      loadDataSuP: null,
      loadMoreShow: false,
      shows: true,
      page: 1,
      limit: 6,
      scroll: '',
      scrollHeight: '',
      offsetHeight: '',
      scrollTop: '',
      item: {
        preview_img: []
      },
      preview_img: '',
      status$: null
    }
  },
  domStreams: ['showModal$'],
  subscriptions() {
    const scroll$ = Observable.fromEvent(window, 'scroll')
    this.showModal$ = new Subject()
    return {
      scroll$,
      showM$: this.showModal$.pipe(
        concatMap(x => {
          return of(x)
        })
      )
    }
  },
  methods: {
    router(string) {
      this.$router.push(`/shop/${string}`)
    },
    menu() {
      this.scrollHeight = document.body.scrollHeight
      this.offsetHeight = document.body.offsetHeight
      this.scrollTop = $(document).scrollTop()
      this.scroll = this.scrollTop + this.offsetHeight
      if (this.loadMoreShow === true) {
        if (this.scroll >= this.scrollHeight - 300) {
          this.loadMoreShow = false
          this.loadData(this.page, this.limit)
        }
      }
    },
    async loadData(page, limit) {
      var data = null
      await api.shop
        .shopList({ page, limit })
        .pipe(
          concatMap(result => {
            data = result.data
            return of(result) //result
          })
        )
        .toPromise()
      return data
      //.subscribe( x => {})
      /**.catch(err => {
      alert(err.message);
      });**/
    },
    showModal(item) {
      this.$refs.itemDetailModal.show()
      this.item = item
      this.preview_img = item.preview_img[0]
      this.$refs.mainContainer.style.zIndex = '1'
    },
    hideModal() {
      this.$refs.mainContainer.style.zIndex = '0'
    },
    loadDataSet() {
      this.loadDataSub = execlib.proxyListen(this, 'loadData', {
        exePos: 'back',
        funRepListen: true,
        isAsync: false
      })
      this.loadDataSuP = this.loadDataSub
        .pipe(
          concatMap(x => {
            return of(x.res)
          })
        )
        .subscribe(result => {
          let { code, preview, hasNext } = result
          if (code === 200) {
            this.items = this.items.concat(preview)
            if (hasNext) {
              this.loadMoreShow = true
              this.page++
            } else {
              this.loadMoreShow = false
            }
          }
        })
    }
  },
  created() {
    var that = this
    this.loadDataSet()
    this.$subscribeTo(this.$observables.scroll$, x => {
      this.menu()
    })
    this.$subscribeTo(this.$observables.showM$, x => {
      this.showModal(x.data)
    })
  },
  async mounted() {
    await this.loadData(1, 6)
  },
  beforeDestroy() {
    //window.removeEventListener("scroll", this.menu);
  }
}
</script>
<style lang="scss" scoped>
@import './Shop.scss';
</style>