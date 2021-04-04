import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { isAuth } from '@/utils'
import httpRequest from '@/utils/httpRequest'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import PubSub from 'pubsub-js'

import '@/icons' // icon
import '@/permission' // permission control
import 'default-passive-events'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest
Vue.prototype.isAuth = isAuth
Vue.prototype.PubSub = PubSub

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
