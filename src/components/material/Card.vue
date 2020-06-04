<template>
  <v-card v-bind="$attrs" :style="styles" v-on="$listeners">
    <helper-offset v-if="hasOffset" :inline="inline" :full-width="fullWidth" :offset="offset">
      <v-card v-if="!$slots.offset" :color="color" :class="`elevation-${elevation}`" class="v-card--material__header d-flex" dark>
        <slot v-if="!title && !text" name="header"/>
        <span v-else> 
          <h4 class="title font-weight-light mb-2" v-text="title" />
          <p class="category font-weight-thin" v-text="text" />
        </span>
        <div class="filter font-weight">
          <div class="text-xs-right">         
            <i class="fas fa-redo-alt pa-2 cursor" @click="refresh"></i>
            
            <!-- FILTERING !! -->
            <v-menu v-if="filter" v-model="filterClear" transition="slide-y-transition" bottom :close-on-content-click="false" class="border-rad-0 pr-2">
              <v-btn small slot="activator" light>
                <span class="pr-1">
                  <i class="fas fa-filter s-10 base-color"></i>
                </span>

                <span class="base-color">
                  Filter
                  <!-- <span> <span class="pl-1 s-10 bold-600" style="color: #647482;">{{filterRange}}</span> </span> -->
                </span>
              </v-btn>

              <v-list class="options">
                <!-- <div class="header">
                  <v-layout align-center>
                    <div class="d-flex justify-space-around px-2">
                      <div>
                        <v-btn class="base-color" :flat="selected" outline small @click="toggleSelected('today')">Today</v-btn>
                      </div>
                      <div>
                        <v-btn class="base-color" :flat="selected" outline small @click="toggleSelected('last_week')">Last week</v-btn>
                      </div>
                      <div>
                        <v-btn class="base-color" :flat="selected" outline small @click="toggleSelected('last_month')" >A month </v-btn>
                      </div>
                      <div>
                        <v-btn class="base-color" :flat="selected" outline small @click="toggleSelected('last year')">1 Year </v-btn>
                      </div>
                    </div>
                  </v-layout>
                </div> -->

                <div class="contentz">
                  <div class="date">
                    <div class="filter_title px-3 py-2">
                      <span class="bold-600">Date</span>
                    </div>
                    <div class="filter_content bg-white px-3 py-2">
                      <div class="from mr-2">
                        <v-layout row wrap>
                          <v-flex>
                            <v-menu
                              ref="menu"
                              :close-on-content-click="false"
                              v-model="menu"
                              :nudge-left="40"
                              :return-value.sync="date"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="from"
                                label="From"
                                readonly
                              >
                              </v-text-field>
                              <v-date-picker v-model="from" no-title scrollable color="green" dark>
                                <v-spacer></v-spacer>
                                <v-btn outline  @click="menu = false" color="base-color">Cancel</v-btn>
                                <v-btn raised  @click="$refs.menu.save(date)" color="base-background">OK</v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-flex>  
                        </v-layout>                      
                      </div>

                      <div class="to">
                        <v-layout row wrap>
                          <v-flex>
                            <v-menu
                              ref="menu1"
                              :close-on-content-click="false"
                              v-model="menu1"
                              :nudge-right="40"
                              :return-value.sync="date"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="to"
                                label="To"
                                readonly
                              >
                              </v-text-field>
                              <v-date-picker v-model="to" no-title scrollable color="green" dark>
                                <v-spacer></v-spacer>
                                <v-btn outline @click="menu1 = false" color="base-color">Cancel</v-btn>
                                <v-btn raised  @click="$refs.menu1.save(date)" color="base-background">OK</v-btn>                             
                              </v-date-picker>
                            </v-menu>
                          </v-flex>  
                        </v-layout>                      
                      </div>                  
                    </div>
                  </div>

                  <div class="status">
                    <div class="filter_title px-3 py-2">
                      <span class="bold-600">Status</span>
                    </div>
                    <div class="filter_content bg-white px-3 py-2">
                      <div class="d-flex w-100">
                        <!-- <v-container fluid class="pa-0">
                          <v-layout row wrap>
                            <v-flex xs12>

                          </v-layout>                          
                        </v-container>   -->
                          <v-radio-group v-model="Filters">
                            <v-checkbox v-model="fl" label="Paid" value="paid" color="success" class="s-10"></v-checkbox>
                            <v-checkbox v-model="fl" label="Pending" value="pending" color="orange" class="s-10"></v-checkbox>
                            <v-checkbox v-model="fl" label="Failed" value="failed" color="red" class="s-10"></v-checkbox>
                          </v-radio-group>

                          <v-radio-group v-model="Filters">
                            <v-checkbox v-model="fl" label="Confirmation Required" value="confirmation required" color="orange" class="s-10"></v-checkbox>
                            <v-checkbox v-model="fl" label="Delivered" value="delivered" color="red" class="s-10"></v-checkbox>
                          </v-radio-group>
                        </v-flex>                                              
                      </div>
                    </div>
                  </div>                  
                </div>

                <div class="footer border-top">
                  <v-layout align-center>
                    <div class="px-2 w-100">
                      <div style="display: flex;justify-content: space-between;">
                        <v-btn @click="clear" class="base-color" depressed small>Clear</v-btn>
                        <v-btn @click="filterALL" class="base-background" raised small>Filter</v-btn>
                      </div>
                    </div>
                  </v-layout>
                </div>
              </v-list>
            </v-menu>

            <!-- GENERATING REPORT!! -->
            <v-menu v-if="filter" v-model="reportClear" transition="slide-y-transition" bottom :close-on-content-click="false" class="border-rad-0 pr-2">
              <v-btn small slot="activator" light>
                <span class="pr-1">
                  <i class="fas fa-file-export base-color"></i>
                </span>
                <span class="base-color">Export</span>                
              </v-btn>

              <v-list class="options">
                <div class="contentz">
                  <div class="date">
                    <div class="filter_title px-3 py-2">
                      <span class="bold-600">Date Range</span>
                    </div>
                    <div class="filter_content bg-white px-3 py-2">
                      <div class="from mr-2">
                        <v-layout row wrap>
                          <v-flex>
                            <v-menu
                              ref="menu2"
                              :close-on-content-click="false"
                              v-model="menu2"
                              :nudge-right="40"
                              :return-value.sync="date"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="form.from"
                                label="From"
                                readonly
                              >
                              </v-text-field>
                              <v-date-picker v-model="form.from" no-title scrollable color="green" dark>
                                <v-spacer></v-spacer>
                                <v-btn outline  @click="menu2 = false" color="base-color">Cancel</v-btn>
                                <v-btn raised  @click="$refs.menu2.save(date)" color="base-background">OK</v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-flex>  
                        </v-layout>                      
                      </div>

                      <div class="to">
                        <v-layout row wrap>
                          <v-flex>
                            <v-menu
                              ref="menu3"
                              :close-on-content-click="false"
                              v-model="menu3"
                              :nudge-right="40"
                              :return-value.sync="date"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="form.to"
                                label="To"
                                readonly
                              >
                              </v-text-field>
                              <v-date-picker v-model="form.to" no-title scrollable color="green" dark>
                                <v-spacer></v-spacer>
                                <v-btn outline @click="menu3 = false" color="base-color">Cancel</v-btn>
                                <v-btn raised  @click="$refs.menu3.save(date)" color="base-background">OK</v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-flex>  
                        </v-layout>                      
                      </div>                      
                    </div>
                  </div>

                  <div class="status">
                    <div class="filter_title px-3 py-2">
                      <span class="bold-600">Fields</span>
                    </div>
                    <div class="filter_content bg-white px-3 py-2">
                      <div class="status_types w-100">
                        <v-container fluid class="pa-0 w-100">
                          <v-layout row wrap>
                            <v-flex xs12 md6>
                              <v-radio-group v-model="Reportrow">
                                <v-checkbox v-model="form.fields" v-for="(field, index) in reportFields.slice(0, 4)" :key="index" :label="field.name" :value="field.key" color="success" class="s-10"></v-checkbox>
                              </v-radio-group>
                            </v-flex>
                            <v-flex xs12 md6>
                              <v-radio-group v-model="Reportrow">
                                <v-checkbox v-model="form.fields" v-for="(field, index) in reportFields.slice(5, 9)" :key="index" :label="field.name" :value="field.key" color="success" class="s-10"></v-checkbox>
                              </v-radio-group>   
                            </v-flex> 
                          </v-layout>             
                        </v-container>                        
                      </div>
                    </div>
                  </div>                  
                </div>
                <div class="footer border-top">
                  <v-layout align-center>
                    <div class="px-2 w-100" style="display: flex;justify-content: space-between;">
                      <div>
                        <v-btn @click="clearReport" class="base-color" depressed small>Clear</v-btn>
                      </div> 

                      <!-- 
                        <div v-if="download" style="display: flex;align-items: center;">
                          <v-btn @click="downloadReport" color="base-background" raised small :loading="loading">Download Report</v-btn>
                          <a :href="`${GET_BASE_URI}v1/accounts/download?file_name=${link}`" class="base-background white-text pa-2 s-13" target="_blank" style="border: none">Download Report</a>
                      </div>  
                      -->

                      <div style="display: flex;align-items: center;">
                        <a @click="reportClear = false" :href="`${GET_BASE_URI}reports/index?token=${token}&${generateQueryParams}`" class="base-background white-text pa-2 s-13" target="_blank" style="border: none">Generate Report</a>
                        <!-- <v-btn @click="generate" color="base-background" raised small :loading="loading">Generate Report</v-btn> -->
                      </div>
                    </div>  
                  </v-layout>                  
                </div>
              </v-list>
            </v-menu>


          </div>      
        </div>
      </v-card> 
      <slot v-else name="offset"/>
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider
      v-if="$slots.actions"
      class="mx-3"
    />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { GET_BASE_URI } from '@/store/store-constants'
import EventBus from '@/event-bus.js'
import Utils from '@/utils/services'
var S3 = require('aws-sdk/clients/s3')

export default {
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: undefined
    },
    filter: {
      type: Boolean,
      default: false
    },
    filterParams: {
      daily: "Transactions for today",
      week: "Transactions from last 7 days",
      month: "Transactions from last 30 days",
      year: "Transactions from last 365 days"
    },
    page: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      download: false,
      filterClear: false,
      reportClear: false,

      from: "",
      to: "",
      date: '',
      menu: false,
      menu1: false,
      row: null,

      column: null,
      report: false,
      fl: [],

      reportFrom: "",
      reportTo: "",
      menu2: false,
      menu3: false,
      Reportrow: null,
      Filters: null,

      form: {
        from: "",
        to: "",
        fields: [] 
      },

      selected: false,
      GET_BASE_URI: GET_BASE_URI,
      filterRange: 'Transactions from Last 30 days'
    }
  },

  mounted() {
    this.$store.dispatch('getReportFields')
    EventBus.$on('toggleDownload', this.toggleDownload)
  },

  methods: {
    refresh(){
      switch (this.page) {
        case 'dashboard':
          this.$store.dispatch('getPurchases', {cache: false})
        break;

        case 'products':
          this.$store.dispatch('getProducts', {cache: false})
        break;

        case 'purchases':
          this.$store.dispatch('getPurchases', {cache: false})
        break;

        case 'agents':
          this.$store.dispatch('getAgents', {cache: false})
        break;  
        
        default:
        break;
      }
    },
    on() {

    },
    toggleDownload () {
      this.download = true
    },    
    generate() {
      this.report = false 
      this.form = {
        start_date: this.reportFrom,
        end_date: this.reportTo,
        fields: this.fl
      }

      // this.$store.dispatch('generateReports', this.form)
      this.$store.dispatch('newGenerateReports', this.form)
      .then((response) => {
        console.log('Success:', response)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
    },
    downloadReport() {
      // this.$store.dispatch('downloadReport')
      this.$store.dispatch('getBucketFile')
    },
    toggleSelected(){
      
    },
    filterALL() {
      this.filterClear = false
      this.form = {}

      this.form = {
        from: this.from,
        to: this.to,
        status: this.fl
      }

      console.log('Filter Parameters:', this.form)
      
      this.$store.dispatch('setPurchasesFilter', this.form)
      this.$store.dispatch('getPurchases', {cache: false})
    },
    clear() {
      this.filterClear = false

      this.from = ''  
      this.to = ''
      this.fl = []

      this.form = {
        from: this.from,
        to: this.to,
        status: this.fl
      }

      this.$store.dispatch('setPurchasesFilter', this.form)
      this.$store.dispatch('getPurchases', {cache: false})
    },

    clearReport() {
      this.reportClear = false

      this.from = ''  
      this.to = ''
      this.fl = []

      this.form = {
        from: this.from,
        to: this.to,
        status: this.fl
      }
    }  
  },  

  computed: {
    ...mapGetters({
      fields: 'fields',
      fieldsState: 'fieldsState',
      link: 'downloadLink',
      token: 'token',
      awsFile: 'awsFile',
      token: 'token'
    }),

    reportFields() {
      return this.fields
    },

    loading(){
      return this.fieldsState === 'LOADING'
    },    

    hasOffset () {
      return this.$slots.header ||
        this.$slots.offset ||
        this.title ||
        this.text
    },
    styles () {
      if (!this.hasOffset) return null

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`
      }
    },
    generateQueryParams() {
      console.log('Query Params:', Utils.createExportQuery(this.form))
      return Utils.createExportQuery(this.form)
    },
  },
}
</script>

<style lang="scss">
  .v-card--material {
    &__header {
      &.v-card {
        border-radius: 4px;
      }
    }
  }

  .contentz {
    .date, .status {
      .filter_title {
        background-color: #f4f6f8;
      }
      .filter_content {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
