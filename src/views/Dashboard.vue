<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md3 lg3>
        <material-stats-card
          color="green"
          icon="mdi-check"
          title="Successful Purchases"
          :value="successfulPurch"
        />
      </v-flex>
      <v-flex sm6 xs12 md3 lg3>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Failed Purchases"
          :value="failedPurch"
        />
      </v-flex>
      <v-flex sm6 xs12 md3 lg3>
        <material-stats-card
          color="orange"
          icon="mdi-dna"
          title="Pending Purchases"
          :value="pendingfulPurch"
        />
      </v-flex>      
      <v-flex sm6 xs12 md3 lg3>
        <material-stats-card
          color="green"
          icon="mdi-content-copy"
          title="Products"
          :value="prod"
          sub-text-color="text-primary"
        />
      </v-flex>
      <v-flex>
        <material-card
          color="green"
          title="Purchases Stats"
          text="All purchases made"
          :filter="true"
          page="dashboard"
        >
          <v-card-title class="pa-0 pb-4">
            <v-text-field
              v-model="search"
              icon="mdi-meteor"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>     

          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            :loading="loading"
            :search="search"
            :pagination.sync="pagination"
          >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
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
              slot-scope="{ index, item }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.product.name }} </td>
              <td class="text-xs-right">GH¢ {{ item.product.unit_price }}</td>
              <td class="text-xs-right">{{ item.previous_quantity }}</td>
              <td class="text-xs-right">{{ item.current_quantity }}</td>
              <td class="text-xs-right">{{ item.reference }}</td>
              <td class="text-xs-left">{{ item.status }}</td>
              <td class="text-xs-left">{{ item.created_at | moment("MMMM Do YYYY, hh:mm a")}}</td>
            </template>
          </v-data-table>
          <div class="text-xs-right pt-2">
            <v-pagination 
              v-model="pagination.page" 
              :length="pages"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"   
              circle            
              >
              </v-pagination>
          </div>          
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      pagination: {},
      dailySalesChart: {
        data: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
            [12, 17, 7, 17, 23, 18, 38]
          ]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [
            [230, 750, 450, 300, 280, 240, 200, 190]
          ]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

          ]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0]
              }
            }
          }]
        ]
      },
      headers: [
        {
          sortable: false,
          text: '#',
          value: 'id'
        },
        {
          text: 'Product',
          value: 'name'
        },       
        {
          text: 'Amount',
          value: 'amount',
          align: 'right'
        },
        {
          text: 'Quantity Before',
          value: 'previous_quantity',
          align: 'right'
        },
        {
          text: 'Quantity After',
          value: 'current_quantity',
          align: 'right'
        },
        {
          text: 'Reference',
          value: 'reference',
          align: 'right'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'left'
        },
        {
          text: 'Date',
          value: 'date',
          align: 'left'
        }                
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      purch: '0',
      prod: '0',
      search: ''
    }
  },
  mounted() {
    this.$store.dispatch('getProducts').then((response) => {
      this.prod = this.productsMeta.totalCount.toString()

    })
    this.$store.dispatch('getPurchases').then((response) =>{
      this.purch = this.purchaseMeta.totalCount.toString()
    })
  },
  created(){
    this.$store.dispatch('getProducts').then((response) =>{
      this.prod = this.productsMeta.totalCount.toString()
    })
    this.$store.dispatch('getPurchases').then((response) =>{
      this.purch = this.purchaseMeta.totalCount.toString()
    })
  },  
  methods: {
    complete (index) {
      this.list[index] = !this.list[index]
    }
  },
  computed: {
    ...mapGetters({
      products: 'products',
      productsState: 'productsState',
      productsMeta: 'productsMeta',
      purchases: 'purchases',
      purchaseState: 'purchasesState',
      purchaseMeta: 'purchasesMeta',
      successfulPurchses: 'successfulPurchases'
    }), 
    filteredProducts() {
      return this.purchases
    },
    meta() {
      return this.purchaseMeta
    },
    loading(){
      return this.purchaseState === 'LOADING'
    },
    successfulPurch() {
      let sucess = 0;
      this.purchases.map(el=> {
        if(el.status === 'paid'){
          sucess++;
        }
      })
      return sucess
    },
    failedPurch() {
      let failed = 0;
      this.purchases.map(el=> {
        if(el.status === 'failed'){
          failed++;
        }
      })
      return failed
    },
    pendingfulPurch() {
      let pending = 0;
      this.purchases.map(el=> {
        if(el.status === 'pending'){
          pending++;
        }
      })
      return pending
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }    
  }
}
</script>
