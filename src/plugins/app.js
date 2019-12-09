import store from '@/store'
import { orientationStatus, isIE, getStore, _debounce } from '@/assets/js/utils'
import { Message } from 'view-design'

// 设置用户信息
store.commit('SET_USER', getStore('user'))

// 设置登陆平台信息
store.commit('setLoginPlatform', getStore('loginPlatformData'))
store.commit('setSelectLoginPlatform', getStore('selectLoginPlatform'))

// 设置菜单展开状态
store.commit('CHANGE_MENU_COLLAPSED', document.documentElement.offsetWidth < 781 ? true : getStore('menuCollapsed') || false)

// 判断设备宽度 大于 750
store.commit('CHANGE_ISMOBILE', document.documentElement.offsetWidth < 781)

window.onresize = _debounce(() => {
  store.commit('CHANGE_ISMOBILE', document.documentElement.offsetWidth < 781)
}, 200)

if (orientationStatus() == 2) {
  Message.warning({
    content: '为了您更好的使用体验,请在竖屏下进行浏览',
    duration: 6,
    closable: true
  })
}

if (isIE()) {
  Message.warning({
    content: '为了您更好的体验，请下载chrome浏览器',
    duration: 6,
    closable: true
  })
}
