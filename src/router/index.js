import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { LoadingBar } from 'iview'

import { routeAll } from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: routeAll
})

// 跳转权限 拦截
router.beforeEach((to, from, next) => {
  LoadingBar.start()
  // 是否登录 跳转判断
  if (to.path != '/login' && !store.getters.isLogin) {
    next({ path: '/login', query: { to: to.fullPath } })
  } else if (to.path != '/login' && to.matched.length == 0 && to.fullPath) {
    next({ path: '/jumppage', query: { fullPath: to.fullPath, path: to.path } })
  } else {
    next()
  }
})

/*eslint no-unused-vars: ["error", { "args": "none" }]*/
router.afterEach(to => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
