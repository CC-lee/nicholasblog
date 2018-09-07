// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'assets/css/commen.css' // 这里的样式可以覆盖index.css
import hljs from './assets/js/highlight.js/lib/index.js'
import router from './routes/index'
import store from './store/index'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'froala-editor/js/froala_editor.pkgd.min'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'font-awesome/css/font-awesome.css'
import 'froala-editor/css/froala_style.min.css'
import VueFroala from 'vue-froala-wysiwyg'
import VueRx from 'vue-rx'
import Rx from 'rxjs/Rx'
Vue.use(VueRx, Rx)
Vue.use(BootstrapVue)
Vue.use(VueFroala)
// import NProgress from 'NProgress'
// import Mock from './mock'
// Mock.bootstrap();
Vue.directive('highlightjs', el => {
  let blocks = el.querySelectorAll('pre')
  Array.prototype.forEach.call(blocks, hljs.highlightBlock)
})

Vue.directive('video', el => {
  let video = el.querySelectorAll('iframe')
  Array.prototype.forEach.call(video, function (video) {
    video.style.height = '40vh'
    //video.style.width = '20vw'
  })
})

Vue.directive('scroll', {
  bind: function (el, binding) {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop + window.innerHeight >= el.clientHeight) {
        //console.log('load data')
      }
    })
  }
})
require('es6-promise').polyfill();
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App } // 此处的components用在了上面的template里面用来编译
})
