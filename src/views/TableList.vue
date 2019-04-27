<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-snackbar :color="color" :top="true" :right="true" v-model="snackbar" dark>
        <div>{{message}}</div>
        <v-icon size="16" @click="snackbar = false">
            mdi-close-circle
        </v-icon>
      </v-snackbar>

    <!-- Confirm Delete -->
      <v-dialog v-model="dialog1" max-width="370">
        <v-card>
          <v-card-title class="headline">Warning</v-card-title>
          <v-card-text>
            <v-flex>
              <v-icon size="20" class="mr-2" color="red"> mdi-alert-circle</v-icon> <span>Are you sure you want to delete this item?</span>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" outline @click="close"> Cancel </v-btn>
            <v-btn color="green darken-1" @click="deleteItem" :loading="loading"> Delete </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>        

    <!-- Save a new Item or Edit an item -->
      <v-flex md12>
        <material-card color="green" title="Products" text="A list of products" :filter="true" page="products">
          <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="green" class="mb-2 add" dark fab icon light round>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
           <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md class="pa-0">
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.name" label="Product Name"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.quantity" label="Quantity" type="number"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.unit_price" label="Unit Price" type="number"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" outline flat @click="close">Cancel</v-btn>
                <v-btn color="green darken-1" @click="save" :loading="loading">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> 
            
          <!-- Table -->
          <v-data-table :headers="headers" :items="filteredProducts" :loading="loading">
            <template slot="headerCell" slot-scope="{ header }">
              <span class="subheading font-weight-light text-success text--darken-3" v-text="header.text"/>
            </template>

            <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.code }}</td>
              <td>{{ props.item.quantity }}</td>
              <td>GH¢ {{ props.item.unit_price }}</td>
              <td>{{props.item.description || 'N/A'}}</td>
              <td class="justify-center px-0">
                <v-icon small class="mr-2" @click="editItem(props.item)">mdi-pencil</v-icon>
                <v-icon small @click="clear(props.item.id)">mdi-delete</v-icon>          
              </td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
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
        text: 'Name',
        value: 'name'
      },
      {
        sortable: false,
        text: 'Code',
        value: 'code'
      },      
      {
        sortable: false,
        text: 'Quantity',
        value: 'quantity'
      },
      {
        sortable: false,
        text: 'Unit Price',
        value: 'unit_price'
      },
      {
        sortable: false,
        text: 'Description',
        value: 'description',
      },
      {
        sortable: false,
        text: '',
        value: ''
      }
    ],
    items: [],
    productsList: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      quantity: 0,
      unit_price: 0.00,
      description: '',
      currency: 'GHs'
    },
    defaultItem: {
      name: '',
      quantity: 0,
      unit_price: 0.00,
      description: '',
      currency: 'GHs'
    },
    confirm: false,
    it: ''
  }),

  created(){
    this.$store.dispatch('getProducts').then((response) => {
      this.productsList = this.products
    })
  },

  computed: {
    ...mapGetters({
      products: 'products',
      state: 'productsState',
      meta: 'productsMeta'
    }), 

    filteredProducts() {
      return this.products
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

  methods: {
    fetchProducts (){
      this.$store.dispatch('getProducts', {cache: false})
    },  

    editItem (item) {
      this.editedIndex = this.productsList.indexOf(item)
      console.log('Index: ', this.editedIndex)
      this.editedItem = Object.assign({}, item)

      if(this.editedIndex === -1){
        this.editedIndex = 1
        setTimeout(() => {
          this.dialog = true
        }, 300)
      } else {
        this.dialog = true
      }
    },

    close () {
      this.dialog = false

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },       

    save () {
      if (this.editedIndex > -1) { 
        console.log('Editing the item!!')
        this.$store.dispatch('updateProduct', this.editedItem)
        .then((response) => {
          if(response.data.status) {
            this.color = 'success'
            this.message = response.data.response.message
            this.snackbar = true

            // Re-fetch products without caching --mini websocket shid!!
            this.$store.dispatch('getProducts', {cache: false})
            .then(() => {
              this.close()
            })
          } else {
            this.message = response.data.response.message
            this.color = 'warning'
            this.snackbar = true
          }
        }).catch((error) => {
            this.message = `${error}`
            this.color = 'error'
            this.snackbar = true
        })
      } else { 
        console.log('Saving a new item')
        this.$store.dispatch('createProduct', this.editedItem)
        .then((response) => {
          if(response.data.status) {
            this.color = 'success'
            this.message = response.data.response.message
            this.snackbar = true

            // Re-fetch products without caching --mini websocket shid!!
            this.$store.dispatch('getProducts', {cache: false})
            .then(() => {
              this.close()
            })            
          } else {
            this.message = response.data.response.message
            this.color = 'warning'
            this.snackbar = true
          }
        }).catch((error) => {
           this.message = `${error}`
            this.color = 'error'
            this.snackbar = true
        })
      }
    },    

    deleteItem () {
      this.$store.dispatch('deleteProduct', this.it)
      .then((response) => {
        this.color = 'success'
        if(response.data.status) {
          this.message = response.data.response.message
          this.snackbar = true
          
          this.$store.dispatch('getProducts', {cache: false})
          .then(() => {
            this.dialog1 = false
          })          
        } else {
          this.message = response.data.response.message
          this.color = 'error'
          this.snackbar = true
        }
      }).catch((error) => {
          this.message = `${error}`
          this.color = 'error'
          this.snackbar = true
      })
    }, 
    
    clear(id){
      this.dialog1 = true;
      this.it = id
    },

    snack (...args) {
      this.top = false
      this.right = false

      for (const loc of args) {
          this[loc] = true
      }

      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      this.snackbar = true
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

 .v-progress-circular {
    margin: 1rem
 }
</style>
