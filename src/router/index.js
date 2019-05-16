import Vue from 'vue'
import Router from 'vue-router'
import Case1 from '~/base/case1'
Vue.use(Router)
export default new Router({
  routes: [
    {
      name: '测试例子',
      path: '/case1',
      component: Case1
    }
  ]
})