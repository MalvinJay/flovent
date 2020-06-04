<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-snackbar :color="color" :top="true" :right="true" v-model="snackbar" dark>
          <div>{{message}}</div>
          <v-icon size="16" @click="snackbar = false">
            mdi-close-circle
          </v-icon>
      </v-snackbar>
      <v-flex md12>
        <material-card color="green" title="Purchases" text="A list of purchases and corresponding histories" :filter="true" page="purchases">     
          <v-card-title class="pa-0 pb-4">
            <v-text-field
              v-model="search"
              icon="mdi-meteor"
              label="Search"
              single-line
              hide-details>
            </v-text-field>
            <v-spacer></v-spacer>

          </v-card-title>
          <v-data-table 
            :headers="headers" 
            :items="filteredProducts" 
            :loading="loading"
            :search="search"
            :pagination.sync="pagination"
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span class="subheading font-weight-light text-success text--darken-3" v-text="header.text"/>
            </template>

            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
                  <!--  {pend: props.item.status === 'pending'}, {confirm: props.item.status === 'confirmation required'} -->
              <tr 
                @click="props.expanded = !props.expanded"
                :class="[{fail: props.item.status === 'failed'},{'bold-600': props.item.status === 'paid'}]"
                >
                <td>{{ props.item.reference }}</td>
                <td>{{ props.item.status }}</td>
                <td>{{ props.item.previous_quantity }}</td>
                <td>{{ props.item.current_quantity }}</td>
                <td>{{ props.item.customer_number || 'N/A'}}</td>
                <td>{{ props.item.product.name || 'N/A'}}</td>
                <td>{{ props.item.created_at | moment("dddd, MMMM Do YYYY, hh:mm a")}}</td>
                <td class="justify-center px-0">
                <!-- 
                  <v-tooltip>
                    <template v-slot:activator="{ on }">
                      <i @click="resendHook(props.item.reference)" v-on="on" class="fas fa-redo-alt pa-2 cursor"></i>
                    </template>
                    <span>Resend Webhook</span>
                  </v-tooltip> 
                -->
                  <i v-if="props.item.status === 'pending' || props.item.status === 'confirmation required'" @click="resendHook(props.item.reference)" class="fas fa-redo-alt pa-2 cursor"></i> 
                  <!-- <i v-if="props.item.status === 'confirmation required'" @click="resendHook(props.item.reference)" class="fas fa-redo-alt pa-2 cursor"></i>  -->
                  <!-- <v-icon>fas fa-circle-notch fa-spin</v-icon> --> 
                  <!-- <i v-if="hook" class="fa-circle-notch fa-spin fas theme--light"></i> --> 
                </td>                
              </tr>
            </template>
            <!-- 
              <template slot="expand" slot-scope="props">
                <v-card>
                  <v-flex xs12 class="">
                    <span class="">Extra Details</span>
                    <v-btn @click="resendHook(props.reference)" color="green" class="mb-2 add" dark fab outline>
                      <i class="fas fa-redo-alt pa-2 cursor"></i>
                      Resend Webhook
                    </v-btn>                                           
                  </v-flex>
                </v-card>          
              </template> 
            -->
          </v-data-table>
          <div class="text-xs-right pt-2">
            <v-pagination 
              v-model="pagination.page" 
              :length="pages"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right" 
              :total-visible="7"
              @next="nextItem"
              @previous="previousItem"
              input
              circle
            >
            </v-pagination>
          </div>           
        </material-card>
      </v-flex>
      <v-flex md12></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Purchases',
    data: () => ({ 
      hook: false,
      expand: false,
      pagination: {
        descending: true,
        // page: 1,
        // rowsPerPage: 20,
        // totalItems: total
      },
      snackbar: false,
      message: 'This is a temp message',
      color: 'success',
      colors: [
      'purple',
      'info',
      'success',
      'warning',
      'error'
      ],     
      dialog: false,
      dialog1: false,
      headers: [
        {
          text: 'Purchase Ref.',
          value: 'reference'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Prev. Qty',
          value: 'previous_quantity'
        },               
        {
          text: 'Current Qty',
          value: 'current_quantity'
        },
        {
          text: 'Customer No.',
          value: 'name'
        },
        {
        text: 'Product',
        value: 'name'
        },        
        {
          text: 'Date',
          value: 'date'
        },
        {
          text: '',
          value: ''
        }             
      ],
      DetailsHeader: [
      {
      text: 'Purchase Ref.',
      value: 'reference'
      },
      {
      text: 'Previous Quantity',
      value: 'previous_quantity'
      },
      {
      text: 'Updated Quantity',
      value: 'current_quantity'
      },
      {
      text: 'Remarks',
      value: 'remarks',
      },
      {
      text: 'Customer No.',
      value: 'name'
      },
      {
      text: 'Product',
      value: 'phone'
      },        
      {
      text: 'Date',
      value: 'date'
      }        
      ],        
      items: [
      ],
      product: [],
      editedIndex: -1,
      confirm: false,
      search: ''
    }),

  methods: {
    resendHook(ref) {
      this.hook = true
      let reference = {
        'transact_ref': ref
      }

      this.$store.dispatch('sendHook', reference)
      .then((response)=>{
          if(response.data.success) {
            this.color = 'success'
            this.message = response.data.response.message
            this.snackbar = true
          } else {
            this.message = response.data.response.message
            this.color = 'warning'
            this.snackbar = true
          }
      })
      .catch((error)=>{
        this.message = `${error}`
        this.color = 'error'
        this.snackbar = true        
      })
    },

    fetchPurchases (){
      this.$store.dispatch('getPurchases', {cache: false})
    },

    editItem (item) {
      // this.editedIndex = this.product.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      this.editedIndex = 0 
      console.log('Item', item)
      this.dialog = true
    },

    deleteItem (item) {
      // const index = this.product.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.product.splice(index, 1)
      this.dialog1 = true;

      if(this.confirm) {
        this.$store.dispatch('deleteProduct', item)
        .then(()=>{
          if(response.data.status) {
            // this.$store.dispatch('getProducts', {cache: false})
            this.message = response.data.response.message
            this.color = 'success'
            this.snackbar = true
            this.close()
          } else {
              this.message = response.data.response.message
              this.color = 'error'
              this.snackbar = true
          }
        }).catch((error) => {
            this.message = 'An error occured, please try again'
            this.color = 'error'
            this.snackbar = true
        })                   
      }
    },    
    
    close (){
      this.dialog = false
      this.dialog1 = false

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    }, 
      
    save (){
      if (this.editedIndex > -1) {
        // Object.assign(this.product[this.editedIndex], this.editedItem)
        console.log('what is this', this.product[this.editedIndex])
      } else {
        // this.product.push(this.editedItem)
        console.log('Product to be saved!!', this.editedItem)
        this.$store.dispatch('createProduct', this.editedItem)
        .then(()=>{
          if(response.data.status) {
            // this.$store.dispatch('getProducts', {cache: false})
            this.message = response.data.response.message
            this.color = 'success'
            this.snackbar = true
            this.close()
          } else {
              this.message = response.data.response.message
              this.color = 'error'
              this.snackbar = true
          }
        }).catch((error) => {
            this.message = 'An error occured, please try again'
            this.color = 'error'
            this.snackbar = true
        })
      }
    },

    snack (...args) {
      this.top = false
      this.right = false

      for (const loc of args) {
        this[loc] = true
      }

      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      this.snackbar = true
    },
    
    clickRow(id){
      this.$router.push(`/purchases/${id}`)
    },

    nextItem(val) {
      console.log('Moving to the next item:', val)

    },

    previousItem(val) {
      console.log('Moving to the previous item:', val)

    }
  },

  created() {
    this.$store.dispatch('getPurchases')
  },

  computed: {
    ...mapGetters({
      purchases: 'purchases',
      state: 'purchasesState',
      meta: 'purchasesMeta'
    }),

    filteredProducts() {
      return this.purchases
    },  

    loading() {
      return this.state === 'LOADING'
    }, 

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    pages() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) 
        return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    total() {
      return this.meta.totalCount
    },
    paginate() {
      return {
        descending: true,
        page: this.meta.page,
        rowsPerPage: this.meta.limit,
        totalItems: this.meta.totalCount
      }
    },
    failed() {
      
    },
    pending() {

    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },
}
</script>

<style lang="scss">
.add {
    position: relative;
    float: right;
    margin-right: 20px;
}

.fail {
  color: red
}
.pend {
  color: orange;
}
.confirm {
  color: rgb(116, 45, 45);
}
</style>
