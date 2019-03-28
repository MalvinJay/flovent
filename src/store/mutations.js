// https://vuex.vuejs.org/en/mutations.html
import { SET_PAGE_LOADING, SET_TEST, SET_TOKEN, LOGOUT, 
  SET_PRODUCTS, SET_PRODUCTS_STATE, SET_PRODUCTS_META,
  SET_PURCHASES, SET_PURCHASES_STATE, SET_PURCHASES_META,
  SET_SUCCESSFUL_PURCHASES
} from './store-constants'

export default {
  // user
  [SET_TOKEN] (state, data) {
    state.logIn = localStorage.getItem('login')
    state.user.token = data
  },
  //   test
  [SET_TEST] (state, data) {
    state.test = data
  },
  [LOGOUT] (state) {
    state.client = {}
    state.user = {
      data: {},
      token: null,
    }
    state.logIn = false
    state.user.token = null
  },
  // page loading
  [SET_PAGE_LOADING] (state, data) {
    state.pageLoading = data
  },

  // Products
  [SET_PRODUCTS] (state, payload) {
    state.products.state = 'DATA'
    state.products.data = payload
  },
  [SET_PRODUCTS_STATE] (state, data) {
    state.products.state = data
  },
  [SET_PRODUCTS_META] (state, data) {
    var meta = {
      totalCount: data.total,
      limit: data.limit,
      page: data.page,
      products: data.products
    }
    state.products.meta = meta
  },

  // Purchases
  [SET_PURCHASES] (state, payload) {
    state.purchases.state = 'DATA'
    state.purchases.data = payload
  },
  [SET_PURCHASES_STATE] (state, data) {
    state.purchases.state = data
  },
  [SET_PURCHASES_META] (state, data) {
    var meta = {
      totalCount: data.total,
      limit: data.limit,
      page: data.page,
      products: data.records
    }
    state.purchases.meta = meta
  },  
  [SET_SUCCESSFUL_PURCHASES] (state, data) {
    state.purchases.successful = data
  },  
}
