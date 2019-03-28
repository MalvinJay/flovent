// https://vuex.vuejs.org/en/getters.html

export default {
  // user
  user: state => state.userdata,
  token: state => state.user.token,

  // product
  products: state => state.products.data,
  productsState: state => state.products.state,
  productsMeta: state => state.products.meta,

  // purchase
  purchases: state => state.purchases.data,
  purchasesState: state => state.purchases.state,
  purchasesMeta: state => state.purchases.meta,
  successfulPurchases: state => state.purchases.successful
}
