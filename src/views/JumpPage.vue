<template lang="pug">
  div
</template>
<script>
import util from '@/assets/js/initRouter.js'
import { getStore } from '@/assets/js/utils'
export default {
  methods: {
    async currentCard(fullPath, path) {
      let tt = await util.initRouter(this, getStore('routeConfig'))
      if (tt) {
        if (fullPath) {
          let isclock = true
          let pathArr = path.split('/')
          pathArr.shift()
          pathArr[0] = '/' + pathArr[0]
          getStore('routeConfig').map(item => {
            if (item.path == pathArr[0]) {
              item.children.map(_item => {
                if (_item.path.includes('/')) {
                  let _pathArr = _item.path.split('/')
                  if (_pathArr[0] == pathArr[1]) {
                    for (let per of getStore('permissionConfig')) {
                      if (_item.meta.permission == per.permName) {
                        isclock = false
                        this.$router.push({ path: fullPath })
                      }
                    }
                  }
                } else {
                  if (_item.path == pathArr[1]) {
                    for (let per of getStore('permissionConfig')) {
                      if (_item.meta.permission == per.permName) {
                        isclock = false
                        this.$router.push({ path: fullPath })
                      }
                    }
                  }
                }
              })
            }
          })
          if (isclock) {
            this.$Message.warning('您的权限不足,请联系管理员！')
            for (let item of this.$store.state.app.routers) {
              for (let _item of getStore('permissionConfig')) {
                if (item.meta.permission == _item.permName) {
                  // console.log(item)
                  if (!item.children[0].meta.isSubmenu) {
                    this.$router.push({ name: item.children[0].name })
                  } else {
                    this.$router.push({ name: item.children[0].children[0].name })
                  }
                  break
                }
              }
            }
          }
        } else {
          this.$store.commit('LOGIN_OUT')
          this.$router.push('/login')
        }
      }
    }
  },
  created() {
    this.currentCard(this.$route.query.fullPath, this.$route.query.path)
  }
}
</script>
