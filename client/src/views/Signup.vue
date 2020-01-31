<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Регистрация</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="email" label="Логин" type="text" required v-model="login"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Пароль" type="password" v-model="pass"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.prevent="register">Зарегистрироваться</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {

    mounted() {
        if (!this.$store.getters.getIsAuth) {
            this.$router.push("/")            
        }
    },

    data: () => ({
        login: null,
        pass: null
    }),

    methods: {
        register(){
            this.$store.dispatch('REGISTER',{login:this.login,pass:this.pass})
        }
    }
  }
</script>