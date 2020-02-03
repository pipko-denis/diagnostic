<template>
    <div>     

      <v-navigation-drawer v-model="drawer" app >
        <v-list dense>
          <v-list-item link v-for="(item,i) in menuItems" text :key="`navmenuitem${i}`" :to="item.route">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="indigo" dark >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Диагностика СПС</v-toolbar-title>
      </v-app-bar>
     
    </div>
</template>

<script>

import { mdiBus } from '@mdi/js';
import { mdiDescription } from '@mdi/js'
import { mdiTapeMeasure } from '@mdi/js'
import { mdiGrid } from '@mdi/js'
import { mdiCarShiftPattern } from '@mdi/js'
import { mdiExitToApp } from '@mdi/js'
import { mdiPower } from '@mdi/js';
import { mdiBusMultiple } from '@mdi/js';
import { mdiChartAreaspline } from '@mdi/js';

    export default {
        name: 'app-header',
        data: () => ({
            drawer: false,        
        }),
        created(){
            this.$store.commit('STORE_INIT')  
        },
        computed: {
            processing: function() {             
                return this.$store.getters.getProcessing
            },
            isUserAuth: function(){
                return this.$store.getters.getIsAuth
            },
            menuItems: function(){
                if (this.isUserAuth){                    
                    return [                    
                        {
                            title:'Машины',
                            route:'/spr_machines',
                            icon: mdiBus,
                            needAuth: true,
                        },
                        {
                            title:'Типы машин',
                            route:'/spr_types',
                            icon: mdiBusMultiple,
                            needAuth: true,
                        },
                        {
                            title:'Диагностические таблицы',
                            route:'/diag_tables',
                            icon: mdiGrid,
                            needAuth: true,
                        },        
                        {
                            title:'Диагностические параметры машин',
                            route:'/diag_machines',
                            icon: mdiCarShiftPattern,
                            needAuth: true,
                        },          
                        {
                            title:'Диаграммы',
                            route:'/diagramms',
                            icon: mdiChartAreaspline,
                            needAuth: true,
                        }, 
                        {
                            title:'Единицы измерения',
                            route:'/diag_dims',
                            icon: mdiTapeMeasure,
                            needAuth: true,
                        },                            
                        {
                            title:'Выйти',
                            route:'/logout',
                            icon: mdiPower,
                            needAuth: true,
                        },

                    ]
                }else{
                    return [
                        {
                            title:'Войти',
                            route:'/signin',
                            icon: mdiExitToApp,
                            needAuth: false,
                        },  
                    ]
                }
            },
        }
        
    }
</script>

<style scoped>

</style>