<template>
  <div>
    <spr-types-list></spr-types-list>
  </div>
</template>

<script>

import SprTypesList from '@/components/SprTypesList'


  export default {
    components:{
      SprTypesList,
    },
    mounted() {
      //console.info("mounted",this.$store.getters.getIsAuth);
        if (!this.$store.getters.getIsAuth) {          
          this.$router.push("/signin")            
        }
    },    
  }
</script>

<style scoped>

</style>