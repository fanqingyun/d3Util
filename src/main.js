import Vue from 'vue'
import App from './App'
import Router from './router/index'
import D3Util from './utils/d3Util'
Vue.prototype.$D3Util = D3Util
new Vue({
  el: '#app',
  components: { App },
  router: Router,
  template: '<App/>'
})