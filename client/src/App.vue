<template>
  <v-app>
    <app-header></app-header>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader';

export default {
  name: 'App',

  components: {
    AppHeader,
  },

  data: () => ({
    //
  }),
};
</script>
