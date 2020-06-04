<template>
  <v-app>
    <!-- <core-filter /> -->
    <core-toolbar />
    <core-drawer />
    <core-view />
  </v-app>   
</template>

<script>
export default {
  name: 'Client',
  data() {
    return {
      
    }
  },
  mounted() {
    if (!this.$session.exists()) {
      // this.logout()
    }    
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$session.remove('client')
        this.$session.destroy()
        this.$router.push('/login')
      })
    }
  },
  onIdle() {    
    this.$store.dispatch('logout')
    .then(() => {
      this.$router.push('/login')
    })
  },
  onActive() {
    setInterval(() => {
      this.$store.dispatch('setClient', JSON.parse(this.$session.get('client')))
    }, 3300000)
  }  
}
</script>

<style>

</style>
