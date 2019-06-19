// 存储localStorage
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export const getStore = name => {
  if (!name || !window.localStorage.getItem(name)) {
    return ''
  }
  return JSON.parse(window.localStorage.getItem(name))
}

// 删除localStorage
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * 权鉴 用户跳转
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.name === name) {
        if (item.meta && item.meta.access) {
          return access.some(_ => item.meta.access.indexOf(_) > -1)
        } else return true
      } else if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      }
    })
  }

  return routePermissionJudge(routes)
}

// 判断路由的用户权限
const showThisMenuEle = (route, access) => {
  if (route.meta && route.meta.permission && access) {
    let _false = false
    access.map(item => {
      if (route.meta.permission == item.permissionName) {
        _false = true
      }
    })
    return _false
  } else return true
}

/**
 * @param {Array} list 通过路由列表
 * @param {Array} access 用户权限
 * @returns {Array} 得到菜单列表
 */
export const getMenuByRouter = (list, access, httplist) => {
  let lists = list
  if (httplist && httplist.length > 0) {
    lists = [...list, ...httplist]
  }

  let res = []

  forEach(lists, item => {
    if (!item.meta || (item.meta && !item.meta.hideMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (((item.children && item.children.length !== 0) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

// 判断手机访问
export const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = false
  for (let v in Agents) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = true
      break
    }
  }
  return flag
}

// 判断phone，pad 横屏还是竖屏
export const orientationStatus = () => {
  if (!isMobile()) return false
  if (window.orientation == 180 || window.orientation == 0) {
    // '竖屏状态！'
    return 1
  }
  if (window.orientation == 90 || window.orientation == -90) {
    // '横屏状态！'
    return 2
  }
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched, homeRoute) => {
  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hide
    })
    .map(item => {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      return obj
    })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [Object.assign(homeRoute, { to: homeRoute.path }), ...res]
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {function} func 需要执行的函数
 * @param {number} wait 等待的时间 毫秒
 * @param {boolean} immediate (defult:false) 默认 代表是否第一次调用立即执行。
 * @description 防抖函数
 */
export const _debounce = (func, wait, immediate) => {
  let timer = null
  let context, args, result, timestamp

  let later = () => {
    let oDate = new Date()
    let last = oDate.getTime() - timestamp
    if (last < wait && last >= 0) {
      timer = setTimeout(later, wait - last)
    } else {
      timer = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timer) context = args = null
      }
    }
  }

  return function() {
    let oDate = new Date()
    let callNow = immediate && !timer
    timestamp = oDate.getTime()
    context = this
    args = arguments
    if (!timer) {
      timer = setTimeout(later, wait)
    }

    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// second 等待秒数
export function sleep(second) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('promise resolved')
    }, second * 1000)
  })
}

// 美化时间
export const goodTime = str => {
  let now = new Date().getTime()
  let oldTime = new Date(str).getTime()
  let difference = now - oldTime
  let result = ''
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24
  // let halfamonth = day * 15
  let month = day * 30
  let year = month * 12

  let _year = difference / year
  let _month = difference / month
  let _week = difference / (7 * day)
  let _day = difference / day
  let _hour = difference / hour
  let _min = difference / minute

  if (_year >= 1) {
    result = ~~_year + ' 年前'
  } else if (_month >= 1) {
    result = ~~_month + ' 个月前'
  } else if (_week >= 1) {
    result = ~~_week + ' 周前'
  } else if (_day >= 1) {
    result = ~~_day + ' 天前'
  } else if (_hour >= 1) {
    result = ~~_hour + ' 个小时前'
  } else if (_min >= 1) {
    result = ~~_min + ' 分钟前'
  } else result = '刚刚'
  return result
}

// 格式化日期
export const formatTime = (t, fmt) => {
  if (!t) return undefined
  let time = new Date(t)
  let o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours() % 12 === 0 ? 12 : time.getHours() % 12, // 小时
    'H+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    S: time.getMilliseconds() // 毫秒
  }
  let week = {
    '0': '天',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[time.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

// 去除前后空格
export const Trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 表单用到的正则
export const regExp = {
  // 正整数(非正整数返回true)
  signlessInt: function(str) {
    return !/^[1-9]\d*$/.test(str)
  },

  // 非身份证号(非身份证号返回true)
  idCard: function(str) {
    let _true = true

    if (str.length !== 18) {
      return _true
    } else {
      let numArr = str.split('')
      let modulusArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      let parallelArr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let _num = 0

      for (let i = 0; i < 17; i++) {
        _num += numArr[i] * modulusArr[i]
      }
      return parallelArr[_num % 11] != numArr[17] ? _true : false
    }
  },

  // 判断手机号是否为11位
  mobile: function(str) {
    return Trim(str).length == 11 ? false : true
  }
}

// 是否为IE
export const isIE = () => {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) return true
  else return false
}

// 是否为firefox
export const isFirefox = () => {
  let ua = window.navigator.userAgent
  if (ua.indexOf('Firefox') != -1) return true
  else return false
}
