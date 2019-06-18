import { 
  GET_BASE_URI, LOGIN, SET_TOKEN, LOGOUT, SET_CLIENT,
  PRODUCTS_FETCH, SET_PRODUCTS_STATE, SET_PRODUCTS_META, SET_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT,
  PURCHASES_FETCH, SET_PURCHASES_STATE, SET_PURCHASES_META, SET_PURCHASES, CREATE_PURCHASE, UPDATE_PURCHASE, DELETE_PURCHASE,
  SET_SUCCESSFUL_PURCHASES,SET_FIELDS_STATE, RESEND_WEBHOOK, 
  GET_FIELDS, SET_REPORT_STATE, SET_REPORT_FIELDS, SET_REPORT_FIELDS_STATE, 
  NEW_GENERATE_REPORTS, GENERATE_REPORTS, GET_REPORT, DOWNLOAD_REPORT, SET_DOWNLOAD_LINK,
  GET_BUCKET_FILE, AWS_BUCKET, ACCESS_KEY_ID, SECRET_ACCESS_KEY, SET_AWS_FILE,
  AGENTS_FETCH, SET_AGENTS, SET_AGENTS_STATE, SET_AGENTS_META, CREATE_AGENT, UPDATE_AGENT, DELETE_AGENT
} from './store-constants'
import { apiCall } from './apiCall'
import axios from 'axios'
import Utils from '../utils/services'
import bus from '@/event-bus'
var S3 = require('aws-sdk/clients/s3')

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
          commit(SET_TOKEN, response.data.response.data.token)
          commit(SET_CLIENT, response.data.response.data)
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
  }, 
  [RESEND_WEBHOOK] ({ commit, rootGetters, dispatch }, reference) {
    commit(SET_PURCHASES_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      axios({
        url: `https://api.flopay.io/v1/rekt_transacts/resend/callback`,
        method: 'POST',
        token: rootGetters.token,
        data: reference,
        headers: {
          'Ctl-Key': '5b1892ab46d583da4542d5951ccf6d38ec27a6a8a3f1e3d9bbeb730827731314'
        },
      })
      .then((response) => {
        commit(SET_PURCHASES_STATE, 'DATA')
        // Post to callback to url
        commit(SET_PURCHASES_STATE, 'LOADING')
        if(response.data.response.data) {
          return new Promise((resolve, reject) => {
            axios({
              url: `${response.data.response.data.transaction.callback_urls[0]}`,
              method: 'POST',
              data: response.data.response.data,
            })
            .then((response) => {
              commit(SET_PURCHASES_STATE, 'DATA')
              dispatch('getPurchases', {page: 1, cache: false})
              resolve(response)
            })
            .catch((error) => {
              commit(SET_PURCHASES_STATE, 'ERROR')
              console.log(error)
              reject(error)
            })
          }) 
        } else 
          resolve(response)
      })
      .catch((error) => {
        commit(SET_PURCHASES_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },   

  // REPORTS
  [GET_FIELDS] ({ state, commit, rootGetters }, {cache = true} = {}) {
    commit(SET_REPORT_FIELDS_STATE, 'LOADING')
    if (cache && state.fields.data.length !== 0) {
      commit(SET_REPORT_FIELDS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/reports/fields.json`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_REPORT_FIELDS_STATE, 'DATA')
          commit(SET_REPORT_FIELDS, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_REPORT_FIELDS_STATE, 'ERROR')
          reject(error)
        })
      })
    }
  },
  [GENERATE_REPORTS] ({ state, commit, rootGetters, dispatch }, report) {
    commit(SET_REPORT_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/reports/custom`,
        method: 'POST',
        token: rootGetters.token,
        data: report
      })
      .then((response) => {
        if (response.data.status) {
          console.log('Job ID:', response.data.response.data.job_id)
          state.fields.job_id = response.data.response.data.job_id
          dispatch(GET_REPORT, state.fields.job_id)
          .then((response) => {
            commit(SET_REPORT_STATE, 'DATA')
            resolve(response)
          })
          .catch((error) => {
            commit(SET_REPORT_STATE, 'ERROR')
            reject(error)
          })
        }
      })
      .catch((error) => {
        console.log(error)
        commit(SET_REPORT_STATE, 'ERROR')
        reject(error)
      })
    })
  },
  [GET_REPORT] ({ state, commit, rootGetters, dispatch }, jobId = state.fields.job_id) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/reports/${jobId}`,
        method: 'GET',
        token: rootGetters.token
      })
      .then((response) => {
        if (response.data.response.data.done) {
          commit(SET_DOWNLOAD_LINK, response.data.response.data.file_name)
          // trigger an event to set the 'download' button active
          bus.$emit('toggleDownload')

          // dispatch(GET_BUCKET_FILE)
          // .then((response) => {
          //   console.log('Response:', response)
          // })
          // .catch((error) => {
          //   console.log('Error:', error)
          // })          

          resolve(response)
        } else {
          reject(response)
          setTimeout(() => {
            dispatch(GET_REPORT, jobId)
              .then((response) => {
                resolve(response)
              }).catch((error) => {
                reject(error)
              })
          }, 5000)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  [DOWNLOAD_REPORT] ({ state, commit, rootGetters }, report = state.fields.link) {
    // let downloadData = {
    //   file_name: report
    // }
    console.log('Download Link', report)
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/reports/download?file_name=${report}`,
        method: 'GET',
        token: rootGetters.token
        // data: downloadData
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        commit(SET_FIELDS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [GET_BUCKET_FILE] ({ state, commit, rootGetters }, linkName = state.fields.link) {
    commit(SET_REPORT_STATE, 'LOADING')

    var BucketName = AWS_BUCKET
    var accessKeyId = ACCESS_KEY_ID
    var SecretAccessKey = SECRET_ACCESS_KEY

    var s3 = new S3({
      // apiVersion: '2006-03-01',
      region: 'us-east-2',
      accessKeyId: accessKeyId,
      secretAccessKey: SecretAccessKey,
      params: {Bucket: BucketName}
    })

    var albumFileKey = encodeURIComponent('inventoribucket') + '/'
    var fileKey = albumFileKey + Utils.randomString2(3) + '_' + linkName

    var params = {Bucket: BucketName, Key: fileKey}
    return new Promise((resolve, reject) => {
      s3.getObject(params, function (err, data) {
        var arr = data.Body;
    
        // This works!!!
        var CHUNK_SZ = 0x8000;
        var c = [];
        for(var i = 0 ; i <arr.length; i+=CHUNK_SZ){
            c.push(String.fromCharCode.apply(null, arr.subarray(i, i+CHUNK_SZ)));
        }
        c = c.join("");
        data = btoa(c);
        console.log('Data From AWS:', data)

        if (err) {
          console.log('err', err)
          commit(SET_REPORT_STATE, 'ERROR')
          reject(err)
          return
        }

        // let admin = {
        //   s3_object_key: data.key,
        //   file_type: fileExtension
        // }

        commit(SET_REPORT_STATE, 'DATA')
        commit(SET_AWS_FILE, data)

        resolve(data)
      })
    })
  }, 
  [NEW_GENERATE_REPORTS] ({ state, commit, rootGetters, dispatch }, params) {
    var query = Utils.createQueryFromObject(params)
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/reports/index?${query}`,
        method: 'GET',
        token: rootGetters.token
      })
      .then((response) => {
        if (response.data.response.data.done) {
          // commit(SET_DOWNLOAD_LINK, response.data.response.data.file_name)
          // bus.$emit('toggleDownload')    

          resolve(response)
        } else {
          reject(response)
          setTimeout(() => {
            dispatch(GET_REPORT, jobId)
              .then((response) => {
                resolve(response)
              }).catch((error) => {
                reject(error)
              })
          }, 5000)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  
  // AGENTS
  [AGENTS_FETCH] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
    var query = `?page=${page}&limit=20`
    commit(SET_AGENTS_STATE, 'LOADING')
    if (cache && state.products.data.length !== 0) {
      commit(SET_AGENTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/agents/list${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_AGENTS_STATE, 'DATA')
          commit(SET_AGENTS_META, response.data.response.data)
          commit(SET_AGENTS, response.data.response.data.agents)
          resolve(response)
        }).catch((error) => {
          commit(SET_AGENTS_STATE, 'ERROR')
          reject(error)
        })
      })
    }
  },
  [CREATE_AGENT] ({ commit, rootGetters, dispatch }, product) {
    commit(SET_AGENTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/agents/add.json`,
        method: 'POST',
        token: rootGetters.token,
        data: product
      }).then((response) => {
        commit(SET_AGENTS_STATE, 'DATA')
        dispatch('getProducts', {page: 1, cache: false})
        resolve(response)
      }).catch((error) => {
        commit(SET_AGENTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },  
  [UPDATE_AGENT] ({ commit, rootGetters }, product) {
    commit(SET_AGENTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/agents/${product.id}/include.json`,
        method: 'PUT',
        token: rootGetters.token,
        data: product
      }).then((response) => {
        commit(SET_AGENTS_STATE, 'DATA')
        resolve(response)
      }).catch((error) => {
        commit(SET_AGENTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },    
  [DELETE_AGENT] ({ commit, rootGetters }, id) {
    commit(SET_AGENTS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/agents/${id}/remove.json`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_AGENTS_STATE, 'DATA')
        resolve(response)
      }).catch(error => {
        commit(SET_AGENTS_STATE, 'ERROR')
        reject(error)
      })
    })
  },  
}
