<template>

</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  mounted() {
      if (!this.$store.getters.getIsAuth) {
          this.$router.push("/signin")            
      }
  },  
  components: {
  }
}
</script>
