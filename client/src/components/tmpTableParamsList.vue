<template>
  <div v-if="this.$store.getters.getIsAuth"> 
    <h1>Список параметров таблицы</h1>

    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" clearable single-line hide-details></v-text-field>   
      <v-spacer></v-spacer> 


      <v-dialog v-model="dialog" fullscreen hide-overlay transition>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2 hidden-sm-and-down mr-1" v-on="on" ><v-icon>{{icoAdd}}</v-icon>Создать таблицу</v-btn>
          <v-btn color="primary" dark class="mb-2 hidden-md-and-up mr-1" v-on="on" ><v-icon>{{icoAdd}}</v-icon></v-btn>
        </template>
        <v-card>

        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close">
            <v-icon>{{icoClose}}</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="save">Сохранить</v-btn>
          </v-toolbar-items>
        </v-toolbar> 

          <v-card-text>

              <v-layout wrap>
                <v-flex sm1 class="pr-1 pl-1" >
                  <v-text-field readonly v-model="editedItem.id" label="ID"></v-text-field>
                </v-flex>  
                <v-flex sm1 class="pr-1 pl-1" >
                  <v-text-field readonly v-model="editedItem.diag_table_id" label="ID таблицы"></v-text-field>
                </v-flex>  
                <v-flex sm11 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.descr" label="Описание параметра"></v-text-field>
                </v-flex>
                <v-flex sm1 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.field_name" label="Название поля"></v-text-field>
                </v-flex>
                <v-flex sm11 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.extra_where" label="Дополнительное условие"></v-text-field>
                </v-flex>                
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.ext_param" label="Код параметра"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-checkbox v-model="editedItem.ds_param_type" label="Тип параметра доверенной среды"></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-checkbox v-model="editedItem.isdiscrete" label="Дискретные данные"></v-checkbox>
                </v-flex>
              </v-layout>
            
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-toolbar>
    
    <v-data-table :headers="headers" :items="tableParams" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.id }} </td>
        <td>{{ props.item.descr }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">{{icoEdit}}</v-icon>
          <v-icon small @click="deleteItem(props.item)">{{icoDel}}</v-icon>
        </td>
        <td class="text-xs-left">{{ props.item.diag_table_id }} </td>
        <td class="text-xs-left">{{ props.item.field_name }} </td>        
        <td class="text-xs-center">{{ props.item.ext_param }}</td>
        <td class="text-xs-center">{{ props.item.ds_param_type }}</td>
        <td class="text-xs-center">{{ props.item.isdiscrete }}</td>        
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getTableParamsFormSrv">Перезагрузить список</v-btn>
      </template>


    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">{{icoEdit}}</v-icon>
      <v-icon small @click="deleteItem(item)">{{icoDel}}</v-icon>
    </template>


    </v-data-table>

  </div>
</template>

<script>

import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiClose } from '@mdi/js';

export default {
    components: {
    },
    data: () => ({
      selectedParamId: -1,
      dialog: false,
      search: null,
      icoSearch: mdiMagnify,
      icoAdd: mdiPlus,
      icoDel: mdiDelete,
      icoEdit: mdiPencil,
      icoClose: mdiClose,
      maskExtCode: "####",
      rowsPerPageItems: [/*25,50,*/{"text":"Все","value":-1}],
      headers: [
        {text: 'Id',align: 'left',sortable: true, value: 'id'},        
        { text: '', align: 'left',value: 'action', sortable: false },
        {text: 'Наименование группы',align: 'left',sortable: true, value: 'group_name'},        
        { text: 'Наименование таблицы', align: 'left',value: 'tbl_name' },
        { text: 'Код пакета', align: 'left',value: 'ext_code' },
        { text: 'Поле с датой', align: 'left',value: 'dt_field' },
        { text: 'Дискретные данные', align: 'left',value: 'isdiscrete' },
      ],
      editedIndex: -1,
      editedItem: {
        id: null,  
        group_name: null,
        tbl_name: null,
        ext_code: null,
        dt_field: null,
        isdiscrete: null,
      },
      defaultItem: {
        id: null,  
        group_name: null,
        tbl_name: null,
        ext_code: null,
        dt_field: null,
        isdiscrete: null,
      },
    }),



    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Добавление таблицы' : 'Редактирование таблицы'
        },
        tableParams(){
            console.info('tableParams', this.$store.getters.getTableParams)
            return this.$store.getters.getTables
        },
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {

      getTableParamsFormSrv(){
        console.info('TablesParamsList', 'GET_TABLES_FROM_SRV')
        this.$store.dispatch('GET_TABLES_FROM_SRV')            
      },

      editItem (item) {
        this.editedIndex = this.tables.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.selectedTableId = item.id        
        console.info('editItem this.selectedTableId=',this.selectedTableId)        
        this.dialog = true
      },

      deleteItem (item) {
        //const index = this.tables.indexOf(item)
        //if confirm('Are you sure you want to delete this item?') && this.tables.splice(index, 1)
        if (confirm('Вы уверены что хотите удалить элемент списка со всеми вложенными эелементами?')){
            if (item.id){
                this.$store.dispatch('DEL_TABLE',item)
            }else{
                this.$store.commit('DEL_TABLE',item)
            }
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.selectedTableId = -1
        }, 300)
      },

      save () {        
        let payload = {table: this.editedItem}
        console.info('save table',payload)  
        this.$store.dispatch('SAVE_TABLE',payload) 
        this.close()
      }
    },

    mounted() {
        this.getTablesFormSrv()
    },

  }
   
</script>

<style scoped>

</style>