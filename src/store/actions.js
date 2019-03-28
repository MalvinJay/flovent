import { GET_BASE_URI, LOGIN, SET_TOKEN, LOGOUT, 
  PRODUCTS_FETCH, SET_PRODUCTS_STATE, SET_PRODUCTS_META, SET_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT,
  PURCHASES_FETCH, SET_PURCHASES_STATE, SET_PURCHASES_META, SET_PURCHASES, CREATE_PURCHASE, UPDATE_PURCHASE, DELETE_PURCHASE,
  SET_SUCCESSFUL_PURCHASES 
} from './store-constants'
import { apiCall } from './apiCall'
import Utils from '../utils/services'

export default {
  // USER
  [LOGIN] ({ state, commit }, {email, password}) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/accounts/login.json?email=${email}&password=${password}`,
        method: 'POST',
      }).then((response) => {
          localStorage.setItem('login', true)
          localStorage.setItem('token', response.data.response.data.token)
          commit(SET_TOKEN, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  [LOGOUT] ({ state, commit }) {
    return new Promise((resolve, reject) => {
      commit(LOGOUT)
      localStorage.clear()
      resolve()
    })
  },  

  // PRODUCTS
  [PRODUCTS_FETCH] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
    var query = `?page=${page}&limit=20`
    commit(SET_PRODUCTS_STATE, 'LOADING')
    if (cache && state.products.data.length !== 0) {
      commit(SET_PRODUCTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/products/list${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_PRODUCTS_STATE, 'DATA')
          commit(SET_PRODUCTS_META, response.data.response.data)
          commit(SET_PRODUCTS, response.data.response.data.products)
          resolve(response)
        }).catch((error) => {
          commit(SET_PRODUCTS_STATE, 'ERROR')
          reject(error)
        })
      })
    }
  },
  [CREATE_PRODUCT] ({ commit, rootGetters, dispatch }, product) {
    commit(SET_PRODUCTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/products/include.json`,
        method: 'POST',
        token: rootGetters.token,
        data: product
      }).then((response) => {
        commit(SET_PRODUCTS_STATE, 'DATA')
        dispatch('getProducts', {page: 1, cache: false})
        resolve(response)
      }).catch((error) => {
        commit(SET_PRODUCTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },  
  [UPDATE_PRODUCT] ({ commit, rootGetters }, product) {
    commit(SET_PRODUCTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/products/${product.id}/include.json`,
        method: 'PUT',
        token: rootGetters.token,
        data: product
      }).then((response) => {
        commit(SET_PRODUCTS_STATE, 'DATA')
        resolve(response)
      }).catch((error) => {
        commit(SET_PRODUCTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },    
  [DELETE_PRODUCT] ({ commit, rootGetters }, id) {
    commit(SET_PRODUCTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/products/${id}/remove.json`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_PRODUCTS_STATE, 'DATA')
        resolve(response)
      }).catch(error => {
        commit(SET_PRODUCTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },

  // PURCHASE
  [PURCHASES_FETCH] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
    var query = `?page=${page}&limit=20`
    let count = 0;

    commit(SET_PURCHASES_STATE, 'LOADING')
    if (cache && state.purchases.data.length !== 0) {
      commit(SET_PURCHASES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/products/histories.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_PURCHASES_STATE, 'DATA')
          commit(SET_PURCHASES_META, response.data.response.data)
          commit(SET_PURCHASES, response.data.response.data.records)
          resolve(response)
        }).catch((error) => {
          commit(SET_PURCHASES_STATE, 'ERROR')
          reject(error)
        })
      })
    }

    rootGetters.purchases.map(el=> {
      if(el.status === 'success'){
        count++;
      }
    })

    commit(SET_SUCCESSFUL_PURCHASES, count.toString())
  },
  [CREATE_PURCHASE] ({ commit, rootGetters, dispatch }, purchase) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/purchases/include.json`,
        method: 'POST',
        token: rootGetters.token,
        data: purchase
      }).then((response) => {
        dispatch('getProducts', {page: 1, cache: false})
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },  
  [UPDATE_PURCHASE] ({ commit, rootGetters }, id) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/purchases/${id}/include.json`,
        method: 'POST',
        token: rootGetters.token,
        data: ticket
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },    
  [DELETE_PURCHASE] ({ rootGetters }, id) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/purchase/${id}/include.json`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
        return error
      })
    })
  }  
}
