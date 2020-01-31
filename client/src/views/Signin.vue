<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Вход в систему</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>                
                <v-form v-model="valid"> 
                  <v-text-field :prepend-icon=svgPerson name="login" label="Логин" type="text" @keyup.13="signin" required v-model="login" :rules="loginRooles"></v-text-field>
                  <v-text-field id="password" :prepend-icon=svgLock name="password" label="Пароль" type="password" @keyup.13="signin" v-model="pass" :rules="passRooles"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.prevent="signin" :disabled="processing || !valid">Войти</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

  import { mdiAccount } from '@mdi/js';
  import { mdiLock } from '@mdi/js';

  export default {   

    data: () => ({
        login: null,//"Pipko",
        pass: null,//"55dc87c474274967",
        valid: false,
        loginRooles:[
          (v) => !!v || 'Необходимо указать логин'
        ],
        passRooles:[
          (v) => !!v || 'Необходимо указать пароль',
          (v) => (v && v.length >= 6) || 'Пароль слишком короткий - минимум 6 символов'
        ],
        svgPerson: mdiAccount,
        svgLock: mdiLock,
    }),
    computed: {
      processing: function() {             
        return this.$store.getters.getProcessing
      },
      isUserAuth: function(){
        return this.$store.getters.getIsAuth
      }
    },
    watch:{
      isUserAuth(val){
         if (val === true ){
           this.$router.push("/")
         }
      }
    },    
    methods: {
        signin(){
            this.$store.dispatch('SIGNIN',{login:this.login,pass:this.pass})            
        }
    },
    created() {
      this.$store.commit('SET_ERROR_CLEAN')
    }

  }
</script>
