// https://vuex.vuejs.org/en/mutations.html
import { SET_PAGE_LOADING, SET_TEST, SET_TOKEN, SET_CLIENT, LOGOUT, 
  SET_PRODUCTS, SET_PRODUCTS_STATE, SET_PRODUCTS_META,
  SET_PURCHASES, SET_PURCHASES_STATE, SET_PURCHASES_META,
  SET_SUCCESSFUL_PURCHASES, 
  SET_REPORT_STATE, SET_REPORT_FIELDS, SET_REPORT_FIELDS_STATE, SET_DOWNLOAD_LINK,
  SET_AWS_FILE, 
  SET_AGENTS, SET_AGENTS_STATE, SET_AGENTS_META,
} from './store-constants'

export default {
  // user
  [SET_TOKEN] (state, data) {
    state.logIn = localStorage.getItem('login')
    state.user.token = data
    state.fields.token = data
  },
  [SET_CLIENT] (state, payload) {
    state.user.data = payload
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

  // Reports
  [SET_REPORT_STATE] (state, data) {
    state.fields.state = data
  },
  [SET_REPORT_FIELDS] (state, payload) {
    state.fields.state = 'DATA'
    state.fields.data = payload
  },  
  [SET_REPORT_FIELDS_STATE] (state, data) {
    state.fields.state = data
  },
  [SET_DOWNLOAD_LINK] (state, payload) {
    state.fields.link = payload
  },
  [SET_AWS_FILE] (state, payload) {
    state.fields.link = payload
  },
  
  // Agents
  [SET_AGENTS] (state, payload) {
    state.agents.state = 'DATA'
    state.agents.data = payload
  },
  [SET_AGENTS_STATE] (state, data) {
    state.agents.state = data
  },
  [SET_AGENTS_META] (state, data) {
    var meta = {
      totalCount: data.total,
      limit: data.limit,
      page: data.page,
      agents: data.agents
    }
    state.agents.meta = meta
  },  
}
