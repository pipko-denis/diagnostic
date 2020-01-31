<template>
  <div>
    <tables-list></tables-list>
  </div>
</template>

<script>

import TablesList from '../components/TablesList';

  export default {
    components: {
      TablesList,
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