import Vue from 'vue'
import App from './App'
import axios from 'axios'

import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import less from 'less'
import local from '@/utils/local'

Vue.use(less)
Vue.prototype.$http = axios
Vue.prototype.HOST='/api'
Vue.use(router)
Vue.use(ElementUI)

// 路由守卫
router.beforeEach((to, from, next) => {
  //获取token
  const token = local.get('hhh_token')
  //判断
  if (token) {
    next()  //放行
  } else {
    //如果去得是登录页面，直接放行
    if (to.path === '/login') {
      next()
    } else {
      next({path:'/login'})
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
