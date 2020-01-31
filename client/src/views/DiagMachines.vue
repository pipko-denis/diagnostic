<template>
  <div>
    <diag-machines-list></diag-machines-list>
  </div>
</template>

<script>

import DiagMachinesList from '@/components/DiagMachinesList'

  export default {

    components:{
      DiagMachinesList,
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