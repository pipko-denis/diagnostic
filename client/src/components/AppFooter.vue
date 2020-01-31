<template>
    <div>
        <v-footer :fixed="false">            
            <span> 
                <img src="/favicon.ico"> НИАЦ АО «ВНИИЖТ» &copy;2019 
            </span>
            <v-spacer></v-spacer>
            <v-alert :value="error" type="warning">{{error}}</v-alert>
            <v-alert :value="message" type="info">{{message}}</v-alert>
            <v-spacer></v-spacer>
            <div>Пользвователь: {{user}}</div>
        </v-footer>
    </div>
</template>

<script>
    export default {

        computed:{
            error: function(){
                return this.$store.getters.getError
            },
            message: function(){
                return this.$store.getters.getMessage
            },
            user: function(){
                return this.$store.getters.getUserName
            },
        }
        
    }
</script>

<style scoped>

</style>