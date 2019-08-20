import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'iview'

/* eslint-disable */
let serviceUrl = BASE_URL
let uploadUrl = UPLOAD_URL

let config = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

let authConfig = { headers: {} }

axios.defaults.withCredentials = true
// axios.defaults.timeout = 15000

// 请求拦截
axios.interceptors.request.use(
  function(config) {
    if (store.getters.isLogin) {
      config.headers.Authorization = store.state.user.token
      authConfig.headers.accessToken = store.state.user.token
    } else if (router.currentRoute.path !== '/login' && !/\/user\//.test(router.currentRoute.path)) {
      Message.error('请先登录！')
      router.push('/login')
    } else {
      config.headers.Authorization = ' '
      authConfig.headers.accessToken = ''
    }
    return config
  },
  function(error) {
    console.log(error)
    return false
  }
)

// 响应拦截
axios.interceptors.response.use(
  function(response) {
    if (new RegExp(/^20\d$/).test(response.status)) {
      // 正常返回格式
      return response.data
    } else {
      Message.error('服务器开小差啦～')
      return false
    }
  },
  function(error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.config.url.substring(error.config.url.length - 15) == 'assign-passport') {
        if (error.response.data.message == '应用不能重复添加通行证') {
          return true
        } else {
          Message.error(error.response.data.message)
          return false
        }
      } else {
        Message.error(error.response.data.message)
        return false
      }
    } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message.error('请求超时，请重试')
      return false
    } else {
      Message.error('服务器开小差啦～')
      return false
    }
  }
)

export { config, axios, serviceUrl, authConfig, uploadUrl }
