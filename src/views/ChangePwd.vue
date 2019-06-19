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
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
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
