<template lang="pug">
  .layout
    Layout
      Header
        Menu.layout-header-menu(mode="horizontal", :active-name="breadCrumbList[1].meta.permission", @on-select="changeHeaderMenu")
          .layout-logo(v-show='!isMobile')
            img(src='../assets/img/logo.png')
          .layout-header-nav
            .loginplatform(v-if="loginPlatformData.length > 1", :class="{'layout-header-nav-mobile': isMobile}")
              Dropdown(trigger='click', placement="bottom-start", transfer)
                Button(type="primary", icon="ios-home-outline", shape="circle", to="/loginplatform")
            
            .layout-header-childrenMenu(v-show='!isMobile && headerMenuItemLists.length > 1')
              MenuItem(v-for="item, index in headerMenuItemLists", :name='item.name', :key="index")
                Icon(:custom="item.icon", v-if="item.iconfont")
                Icon(:type="item.icon || 'ios-bookmark-outline'", v-else)
                span {{item.title}}

            .layout-header-nav-mobile(v-show='isMobile && headerMenuItemLists.length > 1')
              Dropdown(trigger='click', placement="bottom-start", @on-click='headerdropdownClick', transfer)
                Button(type="primary", icon="md-grid", shape="circle")
                DropdownMenu(slot="list")
                  DropdownItem(v-for="item, index in headerMenuItemLists", :name='item.name', :key="index", :divided="index > 0")
                    Icon(:custom="item.icon", v-if="item.iconfont")
                    Icon(:type="item.icon || 'ios-bookmark-outline'", v-else)
                    span.layout-header-nav-mobile-span {{item.title}}

          .layout-header-bar
            .header-account.row(@click="showDropdown = !showDropdown", ref="reference")
              Avatar.avatar(icon="ios-person")
              .header-account-name {{$store.state.user.passportAccount}}
              .header-account-right
                Icon(type="md-arrow-dropdown", size="18", color="#CCCCCC")

              .input-select-dropdown.header-account-dropdown(v-if="showDropdown", ref="dropdown", v-click-outside.capture="onClickOutside")
                span(@click="$router.push('/changepwd')") 修改密码
                span(@click="$store.commit('LOGIN_OUT'), $router.push('/login')") 退出登录

      Layout
        .closeBg(@click='$refs.silder.toggleCollapse()', v-show='isMobile && !collapsed')
        Sider.left-slider(
          :style='{"background": theme == "light" ? "#fff" : ""}',
          ref='silder',
          collapsible,
          :collapsed-width="isMobile ? 0 : 78",
          @on-collapse='collapsedSider',
          v-model="collapsed",
          :class='{"isMobile": isMobile}'
        )
          Menu.menu-item(accordion, :theme="theme", width="auto", :active-name='menuActiveName', :open-names="openNames", @on-select='changeMenu', @on-open-change='openchange', :class="{'collapsed-menu': collapsed}")
            div(v-for="item, i in menuList", :key="i")
              div(v-if='item.meta && item.children && headerMenuItemNameLists.includes(item.name) && item.meta.permission == breadCrumbList[1].meta.permission')
                div(v-for="o, idx in item.children", :key="idx")
                  Submenu(v-if="o.meta.isSubmenu", :name='o.name', :class='{"pc":!isMobile, "hideTitle": collapsed}')
                    template(slot="title")
                      Icon(:custom="o.meta.icon", v-if="!collapsed && o.meta.iconfont")
                      Icon(:type="o.meta.icon || 'ios-bookmark-outline'", v-else)
                      span {{o.meta.title}}
                    MenuItem(v-for="p, idpx in o.children", :key="idpx", :name='p.name')
                      Tooltip(:content="p.meta.title", :theme="theme", placement="right", :transfer='true', v-if='collapsed')
                        Icon(:custom="p.meta.icon", v-if="p.meta.iconfont")
                        Icon(:type="p.meta.icon || 'ios-bookmark-outline'", v-else)
                      Icon(:custom="p.meta.icon", v-else-if="!collapsed && p.meta.iconfont")
                      Icon(:type="p.meta.icon || 'ios-bookmark-outline'", v-else)
                      span {{p.meta.title}}

                  MenuItem(v-else, :name='o.name')
                    Tooltip(:content="o.meta.title", :theme="theme", placement="right", :transfer='true', v-if='collapsed')
                      Icon(:custom="o.meta.icon", v-if="o.meta.iconfont")
                      Icon(:type="o.meta.icon || 'ios-bookmark-outline'", v-else)
                    Icon(:custom="o.meta.icon", v-else-if="!collapsed && o.meta.iconfont")
                    Icon(:type="o.meta.icon || 'ios-bookmark-outline'", v-else)
                    span(style="width: auto;", v-if='!collapsed') {{o.meta.title}}

        Layout.right(:class="{'isMobile': isMobile}")
          .content(:class="{'isMobile': isMobile}")
            div
              Breadcrumb.breadcrumb
                BreadcrumbItem(to='', v-for="item, i in breadCrumbList", v-if="i > 1", :key="i") {{item.meta.title}}

              .routerview(:class="{'mB-100': isfirefox}")
                router-view

</template>
<script>
import { isFirefox } from '@/assets/js/utils'
import { mapMutations } from 'vuex'
import { directive as clickOutside } from 'v-click-outside-x'
export default {
  data() {
    return {
      isfirefox: isFirefox(),
      theme: 'light',
      openNames: [],
      collapsed: this.$store.state.app.menuCollapsed,
      headerMenuItemLists: [],
      headerMenuItemNameLists: [],
      menuActiveName: '',
      showDropdown: false
    }
  },
  directives: { clickOutside },
  watch: {
    $route(newRoute) {
      this.setBreadCrumb(newRoute.matched)
    }
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    },
    isMobile() {
      return this.$store.state.app.isMobile
    },
    menuList() {
      return this.$store.getters.menuList
    },
    loginPlatformData() {
      return this.$store.state.app.loginPlatformData
    }
  },
  methods: {
    ...mapMutations(['setBreadCrumb']),
    onClickOutside(event) {
      if (this.$refs.reference && this.$refs.reference.contains(event.target)) {
        return
      }
      event.preventDefault()
      this.showDropdown = false
    },
    dropdownClick(name) {
      if (name === 'out') {
        this.$store.commit('LOGIN_OUT')
        this.$router.push('/login')
        this.$Message.success('退出成功！')
      } else if (name === 'changepwd') {
        this.$router.push('/changepwd')
      }
    },
    headerdropdownClick(name) {
      for (let item of this.menuList) {
        if (item.meta && name == item.meta.permission) {
          this.$router.push({ name: item.children[0].name })
          break
        }
      }
    },
    changeHeaderMenu(name) {
      for (let item of this.menuList) {
        if (item.meta && name == item.meta.permission) {
          this.$router.push({ name: item.children[0].name })
          break
        }
      }
      this.$nextTick(() => {
        this.menuActiveName = this.breadCrumbList[2].name
      })
    },
    collapsedSider(boolean) {
      this.$store.commit('CHANGE_MENU_COLLAPSED', boolean)
    },
    changeMenu(name) {
      this.$router.push({ name })
    },
    openchange(name) {
      this.openNames[0] = name
    }
  },
  created() {
    this.setBreadCrumb(this.$route.matched)
    // 对当前菜单进行循环，以展示  横向的菜单
    this.$store.getters.menuList.map(item => {
      if (item.meta && item.meta.permission) {
        this.headerMenuItemLists.push({
          name: item.meta.permission,
          iconfont: item.meta.iconfont,
          icon: item.meta.icon || 'ios-apps',
          title: item.meta.title
        })
        this.headerMenuItemNameLists.push(item.meta.permission)
      }
    })
    if (this.breadCrumbList[2].meta.isSubmenu) {
      this.openNames[0] = this.breadCrumbList[2].name
      if (this.breadCrumbList[3]) {
        this.menuActiveName = this.breadCrumbList[3].name
      } else {
        this.$store.getters.menuList.map(item => {
          if (item.meta && item.meta.permission == this.breadCrumbList[1].meta.permission) {
            item.children.map(childItem => {
              if (childItem.meta.permission == this.breadCrumbList[2].meta.permission) {
                this.menuActiveName = childItem.children[0].name
                this.$router.push({ name: this.menuActiveName })
              }
            })
          }
        })
      }
    } else {
      this.menuActiveName = this.breadCrumbList[2].name
    }
  }
}
</script>

<style lang="stylus">
.ivu-layout-header
  padding 0
  background #FFF

.ivu-split-pane.right-pane
  background-color #FFFFFF

.layout
  background #f5f7f9
  position relative
  width 100%
  height 100%
  margin 0
  padding 0

  &-logo
    width 200px
    height 64px
    text-align center
    float left
    position relative

    img
      width 60%

  &-header-menu
    display flex
    flex-direction row

  &-header-nav
    flex 1
    height 64px

  &-header-nav-mobile
    padding-left 20px

    &-span
      margin-left 10px

  &-header-bar
    height 56px
    padding 0 20px
    background #fff
    display flex
    flex-flow row nowrap
    align-items center
    justify-content space-between
    position relative
    z-index 2

  .closeBg
    width 100vw
    height 100vh
    background rgba(0, 0, 0, 0.2)
    position fixed
    left 0
    top 0
    z-index 10000000

  .ivu-layout.right
    position relative
    height 100vh
    overflow hidden

    &.isMobile
      overflow auto
      display block

      .content
        position fixed
        left 0
        right 0
        top 64px

        .clearbox
          height 100px

.left-slider
  overflow-x hidden
  height 100vh

  .ivu-layout-sider-children
    height 100vh
    overflow-y scroll
    box-sizing border-box
    margin-right -16px
    overflow-x hidden

  .ivu-layout-sider-children
    padding-bottom 140px

  &.isMobile
    overflow visible
    position fixed
    z-index 10000001
    box-shadow 0 2px 1px rgba(0, 0, 0, 0.1)

    .ivu-layout-sider-children
      margin-right 0

    .ivu-layout-sider-zero-width-trigger
      z-index 10000000

.menu-item
  .ivu-tooltip
    margin-right 6px

  span
    display inline-block
    overflow hidden
    width 80px
    text-overflow ellipsis
    white-space nowrap
    vertical-align bottom
    transition width 0.2s ease 0.2s

  i
    transform translateX(0px)
    transition font-size 0.2s ease 0.2s
    transform 0.2s ease
    vertical-align middle
    font-size 16px

  &.collapsed-menu
    span
      width 0px
      transition width 0.2s ease

    i
      transform translateX(5px)
      transition font-size 0.2s ease 0.2s
      transform 0.2s ease 0.2s
      vertical-align middle
      font-size 22px

    .ivu-menu-submenu
      span
        width 0px

      .ivu-menu-item
        padding 14px 24px !important

      &.pc
        .ivu-menu-submenu-title-icon
          display none

      &.hideTitle
        .ivu-menu-submenu-title
          display none

  &.ivu-menu-vertical.ivu-menu-light:after
    width 0

.breadcrumb
  margin 20px 20px 0
  text-align left

.content
  position absolute
  top 0
  bottom 0
  width 100%
  overflow auto
  min-height 300px
  padding-bottom 60px
  outline 0
  z-index 200
  -webkit-overflow-scrolling touch

  &::-webkit-scrollbar
    width 8px
    height 8px
    background-color #ffffff

  &::-webkit-scrollbar-track
    -webkit-box-shadow inset 0 0 6px #ffffff
      box-shadow inset 0 0 6px #ffffff

    border-radius 5px
    background-color #ffffff

  &::-webkit-scrollbar-thumb
    -webkit-box-shadow inset 0 0 6px #e5e5e5
      box-shadow inset 0 0 6px #e5e5e5

    border-radius 5px
    background-color rgba(128, 128, 128, 0.5)

  &::-webkit-scrollbar-thumb:hover
    background-color rgba(128, 128, 128, 0.8)

  &.isMobile
    padding-bottom 0

    &::-webkit-scrollbar
      display none

  .routerview
    margin 20px

    &.mB-100
      margin-bottom 100px

.ivu-layout-sider-zero-width-trigger
  top 0

.layout-header-nav
  display flex
  flex-direction row

  &-childrenMenu
    flex 1

.loginplatform
  display inline-block
</style>
