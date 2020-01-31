<template>
  <div>
      <spr-mach-list></spr-mach-list>
  </div>
</template>

<script>

import SprMachList from '@/components/SprMachList'

  export default {
    components:{
      SprMachList,
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
