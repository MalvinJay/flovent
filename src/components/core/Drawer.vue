<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <!-- <v-img
      :src="image"
      height="100%"
    > -->
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >
            <v-img
              :src="logo"
              height="34"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            VentIT
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="purple"
          />
        </v-list-tile>
        <v-list-tile v-for="(link, i) in links" :key="i" :to="link.to" :active-class="color" avatar class="v-list-item">
          <v-list-tile-action><v-icon>{{ link.icon }}</v-icon></v-list-tile-action>
          <v-list-tile-title v-text="link.text"/>
        </v-list-tile>

        <v-list-tile active-class="primary" class="v-list-item v-list__tile--buy" @click="logout">
          <v-list-tile-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="font-weight-light">
            <span>Logout</span>
          </v-list-tile-title>
        </v-list-tile>
        
      </v-layout>
    <!-- </v-img> -->
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    logo: './img/logo.jpg',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      // {
      //   to: '/user-profile',
      //   icon: 'mdi-account',
      //   text: 'User Profile'
      // },
      {
        to: '/products',
        icon: 'mdi-clipboard-outline',
        text: 'Products'
      },
      {
        to: '/purchases',
        icon: 'mdi-history',
        text: 'Purchases'
      },      
      {
        to: '/agents',
        icon: 'mdi-account',
        text: 'Agents'
      },
      // {
      //   to: '/icons',
      //   icon: 'mdi-chart-bubble',
      //   text: 'Icons'
      // },
      // {
      //   to: '/maps',
      //   icon: 'mdi-map-marker',
      //   text: 'Maps'
      // },
      // {
      //   to: '/notifications',
      //   icon: 'mdi-bell',
      //   text: 'Notifications'
      // }    
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    logout(){
      this.$store.dispatch('logout')
      this.$session.destroy()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 50%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
