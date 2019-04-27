// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'

// Components
import './components'

// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import VueMoment from 'vue-moment'
import VueSession from 'vue-session'
import IdleVue from 'idle-vue'

// Sync store with router
sync(store, router)
Vue.use(VueMoment)
Vue.use(VueSession)

Vue.use(Vuetify, {
  iconfont: 'fa'
 })

const eventz = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventz,
  idleTime: 900000,
  store
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
