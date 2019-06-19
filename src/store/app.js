import { routeAll } from '@/router/routes'

import router from '@/router/index'
import { getMenuByRouter, setStore, getStore, getHomeRoute, getBreadCrumbList } from '@/assets/js/utils'

export default {
  state: {
    pageSize: 10,
    homeRoute: getHomeRoute(routeAll),
    breadCrumbList: [],
    menuCollapsed: false,
    isMobile: false,
    loginPlatformData: [],
    selectLoginPlatform: '',
    routers: [],
    getmenuList: []
  },
  getters: {
    menuList: state => getMenuByRouter(routeAll, getStore('permissionConfig'), state.getmenuList)
  },
  mutations: {
    // 设置菜单展开关闭
    CHANGE_MENU_COLLAPSED(state, boolean) {
      state.menuCollapsed = boolean
      setStore('menuCollapsed', boolean)
    },

    // 设置手机版
    CHANGE_ISMOBILE(state, boolean) {
      state.isMobile = boolean
    },

    // 设置面包屑
    setBreadCrumb(state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },

    // 存储所有可选平台信息
    setLoginPlatform(state, data) {
      state.loginPlatformData = data
      setStore('loginPlatformData', data)
    },

    // 存储已选平台信息
    setSelectLoginPlatform(state, data) {
      state.selectLoginPlatform = data
      setStore('selectLoginPlatform', data)
    },

    // 动态添加主界面路由，需要缓存
    updateAppRouter(state, routes) {
      state.routers = []
      state.routers.push(...routes)
      router.addRoutes(routes)
    },

    // 接受前台数组，刷新菜单
    updateMenulist(state, routes) {
      state.getmenuList = routes
    }
  }
}
