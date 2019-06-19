import { setStore, removeStore } from '@/assets/js/utils'
export default {
  state: {
    token: '',
    passportUid: '',
    passportAccount: ''
  },
  getters: {
    isLogin: state => state.token
  },
  mutations: {
    SET_TOKEN(state, data) {
      if (!data) return
      state.token = data
    },
    SET_USER(state, data) {
      if (!data) return
      for (const i in data) {
        state[i] = data[i]
      }
      setStore('user', state)
    },
    LOGIN_OUT(state) {
      state.token = ''
      state.passportUid = ''
      state.passportAccount = ''
      removeStore('user')
      removeStore('loginPlatformData')
      removeStore('newRoutes')
      removeStore('permissionConfig')
      removeStore('routeConfig')
      removeStore('selectLoginPlatform')
    }
  }
}
