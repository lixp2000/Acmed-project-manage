const Main = () => import(/* webpackChunkName: "Main" */ '@/views/Main')

const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')

const LoginPlatform = () => import(/* webpackChunkName: "LoginPlatform" */ '@/views/LoginPlatform.vue')

const ChangePwd = () => import(/* webpackChunkName: "ChangePwd" */ '@/views/ChangePwd.vue')

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')

const JumpPage = () => import(/* webpackChunkName: "JumpPage" */ '@/views/JumpPage.vue')

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = []

/**
 * meta 标签参数 相对于 admin 做了简化
 * @param title: 导航显示的文字
 * @param hideMenu: (default: false) 设为true后在左侧菜单不会显示该页面选项
 * @param showAlways: (default: false) 显示自己的菜单 无论如何都显示 作为一级菜单使用 child 为空
 * @param iconfont: (default: null) 此图标字体是否为自定义的
 * @param icon: (default: -) 该页面在左侧菜单、面包屑和标签导航处显示的图标
 * @param href: 'https://xxx' (default: null) 用于跳转到外部连接
 * @param permission: (default: null) 可访问该页面的权限，当前路由设置的权限会影响子路由
 * @param isSubmenu: (default: false) 是否具有二级显示菜单;如果具有二级菜单，component需要引用JumpSubmenu组件
 */

export const routeAll = [
  {
    path: '/login',
    name: '登录',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/loginplatform',
    name: 'loginPlatform',
    component: LoginPlatform,
    meta: {
      title: '平台选择'
    }
  },
  {
    path: '/jumppage',
    name: 'jumpPage',
    component: JumpPage,
    meta: {
      title: '页面跳转'
    }
  },
  {
    path: '/changepwd',
    name: 'changepwd',
    component: ChangePwd,
    meta: {
      title: '修改密码'
    }
  },
  {
    path: '/',
    name: 'index',
    redirect: '/jumppage',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        redirect: '/jumppage',
        meta: {
          title: '首页'
        },
        component: Home
      }
    ]
  },
  ...appRouter
]
