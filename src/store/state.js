
export default {
  // User
  user: {
    data: {},
    token: localStorage.getItem('token'),
  },
  userdata: {

  },
  client: {

  },
  logIn: localStorage.getItem('login'),
  test: false,
  permissions: {
    data: []
  },
  pageLoading: false,
  pageSize: 12,
  balance: {
    
  },

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
  },

  // Reports
  fields: {
    data: [],
    state: 'Loading',
    link: '',
    token: '',
    job_id: null,
    aws_file: ''
  },

  // Agents
  agents: {
    data: [],
    state: 'LOADING',
    meta: {}
  },  
}
