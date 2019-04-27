/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Router from 'vue-router'
import store from '@/store'
import Meta from 'vue-meta'

// Routes
import paths from './paths'

function route (path, view, name) {
  return {
    name: name || view,
    path,
    component: (resovle) => import(
      `@/views/${view}.vue`
    ).then(resovle)
  }
}

const Client = () => import('@/pages/Client')
const Login = () => import('@/views/Login')
const Dashboard = () => import('@/views/Dashboard')
const Products = () => import('@/views/TableList')
const Agents = () => import('@/views/Agents')
const Purchases = () => import('@/views/Purchases')
const PurchasesDetails = () => import('@/views/PurchaseDetails')
const Icons = () => import('@/views/Icons')
const Notifications = () => import('@/views/Notifications')
const UserProfile = () => import('@/views/UserProfile')

Vue.use(Router)

// Create a new router
const router = new Router({
  mode: 'history',
  // routes: paths.map(path => route(path.path, path.view, path.name)).concat([
  //   { path: '*', redirect: '/dashboard' },

  routes: [
    {
      path: '/',
      name: 'Client',
      component: Client,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },       
        {
          path: '/products',
          name: 'Product',
          component: Products
        },
        {
          path: '/agents',
          name: 'Agents',
          component: Agents
        },        
        {
          path: '/purchases',
          name: 'Purchases',
          component: Purchases
        },        
        {
          path: '/purchases/:id',
          name: 'PurchasesDetails',
          component: PurchasesDetails
        },         
        {
          path: '/icons',
          name: 'Icons',
          component: Icons
        },
        {
          path: '/notifications',
          name: 'Notifications',
          component: Notifications
        },
        {
          path: '/user-profile',
          name: 'User Profile',
          component: UserProfile
        },       
      ],
    },  
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },    
    { 
      path: '*', 
      redirect: '/dashboard' 
    }
  ],

  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
})


Vue.use(Meta)

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== 'development'
    }
  })
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

export default router
