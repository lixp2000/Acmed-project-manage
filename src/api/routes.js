import { axios, serviceUrl, authConfig } from './config'
import qs from 'qs'

export default {
  // 根据通行证和密码获取登录凭证
  postAuthAccessToken: json => axios.post(serviceUrl + '/aorp/auth/v1/access-token', qs.stringify(json)),

  // 根据Token/旧密码修改密码
  postAuthUpdatePassword: json => axios.post(serviceUrl + '/aorp/auth/v1/update-password', qs.stringify(json)),

  // 重置密码
  postAuthResetPassword: json => axios.post(serviceUrl + '/aorp/auth/v1/reset-password', qs.stringify(json), authConfig),

  // 获取RSA公钥
  getRSA: (json, appId, env, cluster, namespace) => axios.get(serviceUrl + '/config-middleware/acmedcare-config/configs/' + appId + '/' + env + '/' + cluster + '/' + namespace, { params: json }),

  // 获取通行证所在机构，应用
  getPlatpassportInfo: json => axios.get(serviceUrl + '/aorp/platform-passport/v2/info', { params: json }),

  // 根据用户通行证以及应用Id获取相关权限信息
  getPlatappApplication: json => axios.get(serviceUrl + '/aorp/platform-app/v2/' + json.passportId + '/applications/' + json.appId)
}
