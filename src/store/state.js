
export default {
  // User
  user: {
    data: {},
    token: '',
  },
  userdata: {},
  client: {},
  logIn: localStorage.getItem('login'),
  test: false,
  permissions: {
    data: []
  },
  pageLoading: false,
  pageSize: 12,
  balance: {},

  // Product
  products: {
    data: [],
    state: 'LOADING',
    meta: {}
  },

  // Purchase
  purchases: {
    data: [],
    state: 'LOADING',
    meta: {},
    successful: '0'
  }
}
