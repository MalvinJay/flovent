<template>
  <!-- <v-app>
    <core-filter />
    <core-toolbar />
    <core-drawer />
    <core-view />
  </v-app> -->

  <v-app>
    <router-view />
  </v-app>
</template>

<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
