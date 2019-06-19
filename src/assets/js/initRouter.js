import lazyLoading from './lazyLoading.js'
let util = {}

util.initRouter = function(vm, routeConfig) {
  const constRoutes = []

  var menuData = []
  menuData = routeConfig

  util.initRouterNode(constRoutes, menuData)

  // 添加主界面路由
  vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children))
  // // 刷新界面菜单
  vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children))

  return true
}

// 生成路由节点
util.initRouterNode = function(routers, data) {
  for (let item of data) {
    let menu = Object.assign({}, item)

    menu.component = lazyLoading(menu.component)

    if (item.children && item.children.length > 0) {
      menu.children = []
      util.initRouterNode(menu.children, item.children)
    }
    let meta = {}
    // 给页面添加标题
    meta.title = menu.meta.title ? menu.meta.title : null
    meta.showAlways = menu.meta.showAlways || null
    meta.hideMenu = menu.meta.hideMenu || null
    meta.permission = menu.meta.permission || null
    meta.icon = menu.meta.icon || null
    meta.iconfont = menu.meta.iconfont || null
    meta.isSubmenu = menu.meta.isSubmenu || false

    menu.meta = meta

    routers.push(menu)
  }
}

export default util
