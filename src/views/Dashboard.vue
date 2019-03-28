<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="Purchases"
          :value="purch"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Successful"
          :value="successfulPurchses"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="Products"
          :value="prod"
          
          sub-text-color="text-primary"
        />
      </v-flex>      
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="info"
          icon="mdi-directions-fork"
          title="Others "
          value="-"
        />
      </v-flex>
      <v-flex
      >
        <material-card
          color="orange"
          title="Purchases Stats"
          text="All purchases made this month"
        >
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            :loading="loading"
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
              <td>{{ item.product.name }}</td>
              <td>{{ item.product.code }}</td>
              <td class="text-xs-right">GH¢ {{ item.product.unit_price }}</td>
              <td class="text-xs-right">{{ item.product.quantity }}</td>
              <td class="text-xs-right">{{ item.reference }}</td>
              <td class="text-xs-right">{{ item.status }}</td>
            </template>
          </v-data-table>
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
          text: 'Amount',
          value: 'amount',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Quantity Left',
          value: 'quantity',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Reference',
          value: 'reference',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Status',
          value: 'status',
          align: 'right'
        }        
      ],
      items: [
        {
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        }, {
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        }, {
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        }, {
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      purch: '0',
      prod: '0'
    }
  },
  mounted(){
    this.$store.dispatch('getProducts').then((response) =>{
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
    }
  }
}
</script>
