<template lang="pug">
  .changePwd
    Card.card(shadow)
      .card-header-text(slot="title")
        img.logoimg(src='../assets/img/logo.png')
        .logotitle 修改密码
        
      Form(ref="formInline", :model="formInline", :rules="ruleInline")
        FormItem(prop="oldPasswords")
          Input(v-model="formInline.oldPasswords" type="password" placeholder="请输入旧密码")
            Icon(type="ios-lock-outline" slot="prepend")

        FormItem(prop="newPasswords")
          Input(v-model="formInline.newPasswords" type="password" placeholder="请输入新密码")
            Icon(type="ios-lock-outline" slot="prepend")

        FormItem(prop="password")
          Input(v-model="formInline.password" type="password" placeholder="请重复新密码")
            Icon(type="ios-lock-outline" slot="prepend")

        FormItem
          Button(type="primary" @click="handleSubmit", long, :loading="btnloading") 确定修改
</template>

<script>
import JsEncrypt from 'jsencrypt'
export default {
  data() {
    return {
      btnloading: false,
      publicKey: '',
      formInline: {
        oldPasswords: '',
        newPasswords: '',
        password: ''
      },
      submitFormInline: {
        oldPassword: '',
        newPassword: ''
      },
      ruleInline: {
        oldPasswords: [
          {
            required: true,
            message: '必填',
            trigger: 'change'
          }
        ],
        newPasswords: [
          {
            type: 'string',
            required: true,
            message: '必填',
            trigger: 'change'
          },
          {
            type: 'string',
            min: 6,
            message: '最低长度6位',
            trigger: 'change'
          },
          {
            type: 'string',
            message: '只支持数字和26个英文字母',
            pattern: '^[A-Za-z0-9]+$',
            trigger: 'change'
          }
        ],
        password: [
          {
            type: 'string',
            validator: (rule, value, callback) => {
              if (this.formInline.newPasswords === this.formInline.password) {
                callback()
              } else {
                callback(new Error('请与新密码相同!'))
              }
            },
            message: '请与新密码相同',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          if (this.formInline.newPasswords && this.formInline.newPasswords.length < 6) {
            this.$Message.warning('新密码不能小于6位')
            return
          }
          let jse = new JsEncrypt()

          jse.setPublicKey(this.publicKey)

          this.submitFormInline.oldPassword = jse.encrypt(this.formInline.oldPasswords)
          this.submitFormInline.newPassword = jse.encrypt(this.formInline.newPasswords)

          this.changePwd()
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    async changePwd() {
      this.btnloading = true
      const res = await this.$api.postAuthUpdatePassword({
        accessToken: this.$store.state.user.token,
        oldPassword: this.submitFormInline.oldPassword,
        newPassword: this.submitFormInline.newPassword
      })
      this.btnloading = false
      if (typeof res == 'boolean' && !res) return
      this.$Message.success('密码修改成功!')
      this.$router.push('/login')
    },
    // 获取RSA公钥
    async getRSA() {
      const res = await this.$api.getRSA({}, '200000', 'dev', 'default', 'application')
      if (typeof res == 'boolean' && !res) return
      this.publicKey = res.configurations['acmedcare.frontend.password.encrpty.rsa-public-key']
    }
  },
  created() {
    this.getRSA()
  }
}
</script>
<style lang="stylus" scoped>
.changePwd
  background #f5f7f9
  height 100vh
  width 100vw
  display flex
  justify-content center

  .card
    width 340px
    height 400px
    padding 0 20px
    margin-top 8rem

  .logoimg
    margin-top 20px
    width 70%

  .logotitle
    margin-top 25px
    font-size 18px

.card-header-text
  display flex
  flex-direction column
</style>
