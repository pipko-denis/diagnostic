<template>
    <div>
        <h1>Logout</h1>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.$store.dispatch('STATE_CHANGED',{token: null, isAuth: false,username: "",id: null})
            this.$router.push("/signin")            
        }
    }
</script>

<style scoped>

</style>