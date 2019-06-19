import { axios, serviceUrl, authConfig } from './config'
import qs from 'qs'

export default {
  // 根据通行证和密码获取登录凭证
  postAuthAccessToken: json => axios.post(serviceUrl + '/aorp/auth/v1/access-token', qs.stringify(json)),

  // 根据Token/旧密码修改密码
  postAuthUpdatePassword: json => axios.post(serviceUrl + '/aorp/auth/v1/update-password', qs.stringify(json)),

  // 重置密码
  postAuthResetPassword: json => axios.post(serviceUrl + '/aorp/auth/v1/reset-password', qs.stringify(json), authConfig),

  // 根据登录凭证获取用户详情，角色，权限，可用区域信息
  getMidRapLogin: json => axios.get(serviceUrl + '/aorp-middleware/middleware-rap/login', { params: json }),

  // 获取RSA公钥
  getRSA: (json, appId, env, cluster, namespace) => axios.get(serviceUrl + '/config-middleware/acmedcare-config/configs/' + appId + '/' + env + '/' + cluster + '/' + namespace, { params: json }),

  // 查询项目应用模块配置
  getPlatProModuleConfig: (areaNo, orgId, projectId, appId) => axios.get(serviceUrl + '/aorp/platform-project/v1/' + areaNo + '/' + orgId + '/' + projectId + '/' + appId + '/module/config')
}
