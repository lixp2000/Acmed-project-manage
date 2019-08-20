<template lang="pug">
  div
    .box-card(v-if="!$store.state.app.isMobile")
      .box-card-user(@click="showDropdown = !showDropdown", ref="reference")
        img(src="../assets/img/loginplatform-user.png")
        span {{$store.state.user.passportAccount}}

        .input-select-dropdown.header-account-dropdown(v-if="showDropdown", ref="dropdown", v-click-outside.capture="onClickOutside")
          span(@click="$router.push('/changepwd')") 修改密码
          span(@click="$store.commit('LOGIN_OUT'), $router.push('/login')") 退出登录

      .box-card-div(v-for="item, index in $store.state.app.loginPlatformData", :key="index", @click="currentCard(item)")
        img.box-card-background(:src="card")
        div
          span {{item.orgName}}
          span {{item.appName}}
        img.box-card-div-btn(src="../assets/img/loginplatformImg-card-btn.png")


    .row(v-if="$store.state.app.isMobile")
      .card-phone(v-for="item, index in $store.state.app.loginPlatformData", :key="index", @click="currentCard(item)")
        .mB-10.card-phone-top
          span {{item.orgName}}

        div
          span ( {{item.appName}} )

</template>
<script>
import cardImg from '@/assets/img/loginplatformImg-card.png'
import util from '@/assets/js/initRouter.js'
import initRouters from '@/router/initRouters.js'
import { setStore } from '@/assets/js/utils'
import { directive as clickOutside } from 'v-click-outside-x'

// 拉取权限--demo文件，实际使用时需删除
import permissionConfig from './permissionConfig'
export default {
  data() {
    return {
      showDropdown: false,
      card: cardImg,
      areaNo: '',
      orgId: '',
      projectId: '',
      appId: ''
    }
  },
  directives: { clickOutside },
  methods: {
    onClickOutside(event) {
      if (this.$refs.reference && this.$refs.reference.contains(event.target)) {
        return
      }
      event.preventDefault()
      this.showDropdown = false
    },
    async currentCard(row) {
      this.$Spin.show()
      let permissionConfigArr = []
      this.areaNo = row.areaNo
      this.orgId = row.orgId
      this.projectId = row.projectId
      this.appId = row.appId

      this.$store.commit('setSelectLoginPlatform', row)

      let routeConfig = []

      routeConfig = initRouters

      setStore('routeConfig', routeConfig)

      // 此处从接口拉取用户对应的权限，实际使用时需清除注销
      // let permissionConfig = await this.getPlatappApplication()
      // if (typeof permissionConfig == 'boolean' && !permissionConfig) {
      //   this.$Spin.hide()
      //   return
      // }
      permissionConfigArr = permissionConfig

      // 将权限存放在本地
      setStore('permissionConfig', permissionConfigArr)
      setStore('selectLoginPlatform', row)
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
                      this.$Spin.hide()
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
          this.$Spin.hide()
          this.$Modal.confirm({
            title: '权限提示',
            content: '请联系管理员设置访问权限!'
          })
        }
      }
    },
    // 根据用户通行证以及应用Id获取相关权限信息
    async getPlatappApplication() {
      const res = await this.$api.getPlatappApplication({
        passportId: this.$store.state.user.passportUid,
        appId: this.appId
      })
      if (typeof res == 'boolean' && !res) return false
      return res
    },
    // 获取通行证所在机构，应用
    async getPlatpassportInfo() {
      const res = await this.$api.getPlatpassportInfo({
        access_token: this.$store.state.user.token
      })
      if (typeof res == 'boolean' && !res) return false
      return res
    }
  }
}
</script>
<style lang="stylus" scoped>
.row
  display flex
  flex-direction column
  justify-content center
  align-items center
  box-sizing border-box

.box
  height 100vh
  display flex
  flex-flow row wrap
  justify-content center
  align-items center
  box-sizing border-box

  .card
    width 340px
    height 200px
    margin-left 5px
    box-sizing border-box
    cursor pointer

    .title
      position relative

      .local
        position absolute
        top 0

      .card-header-text
        flex 1
        display flex
        justify-content center
        align-items center

.box-card
  width 100vw
  height 100vh
  background url('../assets/img/loginplatformImg.png') no-repeat center center, linear-gradient(rgba(78, 97, 237, 1), rgba(98, 196, 219, 1))
  background-size cover
  display flex
  flex-flow row wrap
  justify-content center
  align-items center
  box-sizing border-box

  &-div
    position relative
    width 300px
    height 180px
    box-sizing border-box
    margin-right 30px
    cursor pointer

    & > div
      position absolute
      top 0
      left 0
      width 100%
      height 80%
      display flex
      flex-direction column
      justify-content center
      align-items center
      font-family PingFangSC-Semibold
      font-weight 600
      color rgba(0, 28, 67, 1)
      font-size 13px

      & > span:first-child
        margin-bottom 15px

    &-btn
      position absolute
      left 80px
      bottom -12px
      width 140px
      height 34px

  &-background
    width 100%
    height 100%

  &-user
    position absolute
    top 11px
    right 59px
    cursor pointer
    display flex
    flex-direction row
    align-items center
    font-family PingFangSC-Regular
    font-weight Regular
    color #ffffff
    font-size 13px
    user-select none

    .header-account-dropdown
      width 100%
      top 55px

      span
        display block
        line-height 40px
        padding-left 20px
        color rgba(0, 28, 67, 1)
        -webkit-transition background 0.3s ease-in-out
        transition background 0.3s ease-in-out

        &:hover
          background-color #e8eaec

    img
      width 40px
      height 40px
      border-radius 50px
      margin-right 10px

.card-phone
  width 360px
  height 80px
  border-radius 5px
  background linear-gradient(to left, rgba(36, 130, 255, 1), rgba(36, 130, 255, 0.7))
  margin-top 10px
  -webkit-transition background 0.5s ease-in-out
  transition background 0.5s ease-in-out
  display flex
  flex-direction column
  justify-content center
  align-items center
  padding 0 10px
  color #ffffff
  user-select none

  &-top
    font-size 18px

  &:hover
    background linear-gradient(to left, rgba(36, 130, 255, 0.6), rgba(36, 130, 255, 0.3))

  &:active
    background linear-gradient(to left, rgba(36, 130, 255, 0.5), rgba(36, 130, 255, 0.2))
</style>
