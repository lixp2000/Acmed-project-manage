<template lang="pug">
  .login
    Card.card(:padding="0", :bordered="false")
      .logo
        img(src='../assets/img/img_denglu.png')
      
      Form.form(ref="formInline", :model="formInline", :rules="ruleInline")
        FormItem(prop="passport")
          Input(prefix="ios-person-outline", v-model="formInline.passport", placeholder="用户名", @on-enter='handleSubmit("formInline")')
        
        FormItem(prop="Nopaddword")
          Input(prefix="ios-lock-outline", type="password", password, v-model="formInline.Nopaddword", placeholder="密码", @on-enter='handleSubmit("formInline")')
        
        Row
          Col.row
            Checkbox(v-model="checked") 记住密码
            span.forgetpass(@click="forgetpass") 忘记密码

        FormItem.mt20
          .svg(v-if="isCoverShow")
            svg(version="1.1", viewBox="0 0 100 100", enable-background="new 0 0 0 0", xml:space="preserve")
              path(fill="#FFF", d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50")
                animateTransform(attributeName="transform", attributeType="XML", type="rotate", dur="1s", from="0 50 50", to="360 50 50", repeatCount="indefinite")
          .formbutton(v-if="!isCoverShow", @click="handleSubmit")
            span 登录

        .button 注意：公共场所不建议记住密码，以防账号丢失
  
</template>

<script>
import JsEncrypt from 'jsencrypt'
import util from '@/assets/js/initRouter.js'
import initRouters from '@/router/initRouters.js'
import { setStore, getStore, removeStore } from '@/assets/js/utils'

// 拉取权限--demo文件，实际使用时需删除
import permissionConfig from './permissionConfig'
export default {
  data() {
    return {
      checked: true,
      formInline: {
        passport: '',
        password: '',
        Nopaddword: ''
      },
      ruleInline: {
        passport: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        Nopaddword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度最低6位',
            trigger: 'blur'
          }
        ]
      },
      publicKey: '',
      appInfo: '',
      isCoverShow: false
    }
  },
  methods: {
    async handleSubmit() {
      this.$refs.formInline.validate(async valid => {
        if (valid) {
          this.isCoverShow = true

          let jse = new JsEncrypt()

          jse.setPublicKey(this.publicKey)

          this.formInline.password = jse.encrypt(this.formInline.Nopaddword)
          if (this.formInline.password === this.formInline.Nopaddword) {
            this.$Message.warning({
              content: '网络状况不佳，请刷新后重新登陆！',
              duration: 2.5
            })
            return
          }

          let accessToken = await this.postAuthAccessToken() // 获取token
          if (typeof accessToken == 'boolean' && !accessToken) {
            this.isCoverShow = false
            return
          }

          if (this.checked) {
            setStore('remAccountPassword', this.formInline)
          } else {
            removeStore('remAccountPassword')
          }
          setStore('accountPasswordIschecked', this.checked)
          this.$store.commit('SET_TOKEN', accessToken.access_token)

          let loginInfomation = await this.getPlatpassportInfo()
          if (typeof loginInfomation == 'boolean' && !loginInfomation) {
            this.isCoverShow = false
            this.$store.commit('LOGIN_OUT')
            return
          }

          let appLists = []
          let permissionConfigArr = []

          this.$store.commit('SET_USER', {
            passportUid: loginInfomation.passportId,
            passportAccount: loginInfomation.passportAccount
          })

          appLists = loginInfomation.apps

          this.$store.commit('setLoginPlatform', loginInfomation.apps)

          if (appLists.length > 1) {
            this.$router.push({ name: 'loginPlatform' })
          } else if (appLists.length == 1) {
            this.appInfo = appLists[0]
            this.$store.commit('setSelectLoginPlatform', appLists[0])
            setStore('selectLoginPlatform', appLists[0])

            let routeConfig = []

            routeConfig = initRouters

            setStore('routeConfig', routeConfig)

            // 此处从接口拉取用户对应的权限，实际使用时需清除注销
            // let permissionConfig = await this.getPlatappApplication()
            // this.isCoverShow = false
            // if (typeof permissionConfig == 'boolean' && !permissionConfig) return
            permissionConfigArr = permissionConfig

            // 将权限存放在本地
            setStore('permissionConfig', permissionConfigArr)

            let tt = await util.initRouter(this, routeConfig)
            if (tt) {
              let clocked = true
              let twoClocked = true
              for (let item of this.$store.state.app.routers) {
                for (let _item of permissionConfigArr) {
                  if (item.meta.permission == _item.permName) {
                    for (let key of item.children) {
                      if (twoClocked) {
                        for (let _key of permissionConfigArr) {
                          if (key.meta.permission == _key.permName) {
                            this.$router.push({ name: key.name })
                            clocked = false
                            twoClocked = false
                            break
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (clocked) {
                this.isCoverShow = false
                this.$Modal.confirm({
                  title: '权限提示',
                  content: '请联系管理员设置访问权限!'
                })
              }
            }
          } else {
            this.isCoverShow = false
            this.$Modal.confirm({
              title: '权限提示',
              content: '请联系管理员设置访问权限!'
            })
          }
        } else {
          this.$Message.error('用户名或密码输入错误!')
        }
      })
    },
    forgetpass() {
      this.isCoverShow = false
      this.$Modal.warning({
        title: '提示',
        content: '请联系管理员重置密码!'
      })
    },
    // 获取RSA公钥
    async getRSA() {
      const res = await this.$api.getRSA({}, '200000', 'dev', 'default', 'application')
      if (typeof res == 'boolean' && !res) return
      this.publicKey = res.configurations['acmedcare.frontend.password.encrpty.rsa-public-key']
    },
    // 根据通行证和密码获取登录凭证
    async postAuthAccessToken() {
      try {
        const res = await this.$api.postAuthAccessToken({
          passport: this.formInline.passport,
          password: this.formInline.password
        })
        return res
      } catch (err) {
        this.isCoverShow = false
        return false
      }
    },
    // 获取通行证所在机构，应用
    async getPlatpassportInfo() {
      const res = await this.$api.getPlatpassportInfo({
        access_token: this.$store.state.user.token
      })
      if (typeof res == 'boolean' && !res) return false
      return res
    },
    // 根据用户通行证以及应用Id获取相关权限信息
    async getPlatappApplication() {
      const res = await this.$api.getPlatappApplication({
        passportId: this.$store.state.user.passportUid,
        appId: this.appInfo.appId
      })
      if (typeof res == 'boolean' && !res) return false
      return res
    }
  },
  created() {
    if (getStore('remAccountPassword')) {
      let res = getStore('remAccountPassword')
      this.formInline.passport = res.passport
      this.formInline.Nopaddword = res.Nopaddword
    }
    this.checked = getStore('accountPasswordIschecked') || false
    this.getRSA()
  }
}
</script>

<style lang="stylus" scoped>
.login
  background #f5f7f9
  height 100vh
  width 100vw
  position absolute
  left 0
  top 0
  background url('../assets/img/img_ditu.png') no-repeat center center, -webkit-linear-gradient(rgba(78, 97, 237, 1), rgba(98, 196, 219, 1))
  background url('../assets/img/img_ditu.png') no-repeat, -o-linear-gradient(rgba(78, 97, 237, 1), rgba(98, 196, 219, 1))
  background url('../assets/img/img_ditu.png') no-repeat, -moz-linear-gradient(rgba(78, 97, 237, 1), rgba(98, 196, 219, 1))
  background url('../assets/img/img_ditu.png') no-repeat center center, linear-gradient(rgba(78, 97, 237, 1), rgba(98, 196, 219, 1))
  background-size cover

  .card
    width 340px
    position absolute
    left 50%
    top 45%
    transform translate(-50%, -50%)

    .logo
      img
        width 100%

    .mt20
      margin-top 20px

    .mt50
      margin-top 50px

    .form
      padding 31px 30px 40px 30px

      .row
        display flex
        flex-direction row
        justify-content space-between

        .forgetpass
          color #000
          cursor pointer

          &:hover
            color #2d8cf0

      .svg
        width 100%
        height 34px
        background-color rgba(50, 187, 220, 0.5)
        color #ffffff
        display flex
        justify-content center
        border-radius 3px
        user-select none

        svg
          width 34px
          height 34px

      .formbutton
        width 100%
        height 34px
        background-color #32bbdc
        color #ffffff
        display flex
        justify-content center
        align-items center
        border-radius 3px
        cursor pointer
        user-select none

        &:hover
          background-color tint(#32bbdc, 20%)

        &:active
          background-color shade(#32bbdc, 5%)

      .button
        font-size 12px
        color #b3b3b3
</style>
