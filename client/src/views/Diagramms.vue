<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <chart-card :propShowSelecors="true" ></chart-card>
        </v-col>  
      </v-row>
    </v-container>
</template>

<script>

import ChartCard from '@/components/ChartCard'

  export default {
   name: 'Diagramms',
  components:{
    ChartCard,
  },
  mounted() {
      if (!this.$store.getters.getIsAuth) {
          this.$router.push("/signin")            
      }
  },    
  }
</script>

<style scoped>

</style>