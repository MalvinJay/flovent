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
          <v-data-table :headers="headers" :items="filteredProducts" :loading="loading">
            <template slot="headerCell" slot-scope="{ header }">
              <span class="subheading font-weight-light text-success text--darken-3" v-text="header.text"/>
            </template>
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.reference }}</td>
                <td>{{ props.item.status }}</td>
                <td>{{ props.item.previous_quantity }}</td>
                <td>{{ props.item.current_quantity }}</td>
                <!-- <td>{{ props.item.remarks || 'N/A'}}</td> -->
                <td>{{ props.item.customer_number || 'N/A'}}</td>
                <td>{{ props.item.product.name || 'N/A'}}</td>
                <td>{{ props.item.created_at | moment("dddd, MMMM Do YYYY, hh:mm a")}}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-container
                fill-height
                fluid
                grid-list-xl>
                <v-layout wrap>
                  <v-flex>
                    <material-card
                      color="green"
                      title="Purchase Details"
                      text="Purchase history details"
                    >
                      <v-data-table
                        :headers="DetailsHeader"
                        :items="item"
                      >
                        <template
                          slot="headerCell"
                          slot-scope="{ header }"
                        >
                          <span
                            class="font-weight-light text-warning text--darken-3"
                            v-text="header.text"
                          />
                        </template>
                        <template
                          slot="items"
                          slot-scope="props"
                        >
                          <td>{{props.item}}</td>
                          <td>{{ props.item.product.name }}</td>
                          <td class="text-xs-right">GH¢ {{ props.item.product.unit_price }}</td>
                          <td class="text-xs-right">{{ props.item.product.quantity }}</td>
                          <td class="text-xs-right">{{ props.item.reference }}</td>
                        </template>
                      </v-data-table>
                    </material-card>
                  </v-flex>
                </v-layout>
              </v-container>              
            </template>            
          </v-data-table>
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
            sortable: false,
            text: 'Purchase Ref.',
            value: 'reference'
        },
        {
            sortable: false,
            text: 'Status',
            value: 'status'
        },
        {
            sortable: false,
            text: 'Prev. Qty',
            value: 'previous_quantity'
        },               
        {
            sortable: false,
            text: 'Current Qty',
            value: 'current_quantity'
        },
        // {
        //     sortable: false,
        //     text: 'Remarks',
        //     value: 'remarks',
        // },
        {
            sortable: false,
            text: 'Customer No.',
            value: 'name'
        },
        {
          sortable: false,
          text: 'Product',
          value: 'name'
        },        
        {
            sortable: false,
            text: 'Date',
            value: 'date'
        }        
        ],
        DetailsHeader: [
        {
          sortable: false,
          text: 'Purchase Ref.',
          value: 'reference'
        },
        {
          sortable: false,
          text: 'Previous Quantity',
          value: 'previous_quantity'
        },
        {
          sortable: false,
          text: 'Updated Quantity',
          value: 'current_quantity'
        },
        {
          sortable: false,
          text: 'Remarks',
          value: 'remarks',
        },
        {
          sortable: false,
          text: 'Customer No.',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Product',
          value: 'phone'
        },        
        {
          sortable: false,
          text: 'Date',
          value: 'date'
        }        
        ],        
        items: [
        ],
        product: [],
        editedIndex: -1,
        confirm: false,
    }),

  methods: {
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
    
    close () {
      this.dialog = false
      this.dialog1 = false

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    }, 
      
    save () {
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
    }
  },

  created(){
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

.v-dialog__container{
  width: 100%;
}
</style>
