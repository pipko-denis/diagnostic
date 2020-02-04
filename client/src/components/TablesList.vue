<template>
  <div v-if="this.$store.getters.getIsAuth"> 
    <h1>Список таблиц</h1>

    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" clearable single-line hide-details></v-text-field>   
      <v-spacer></v-spacer> 

      <v-dialog v-model="dialog" fullscreen hide-overlay transition>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2 hidden-sm-and-down mr-1" v-on="on" ><v-icon>{{icoAdd}}</v-icon>Создать таблицу</v-btn>
          <v-btn color="primary" dark class="mb-2 hidden-md-and-up mr-1" v-on="on" ><v-icon>{{icoAdd}}</v-icon></v-btn>
        </template>
        <v-card>

        <v-dialog v-model="dialogDt" scrollable  max-width="360px"> 
          <v-card tile>           
            <v-card-title class="primary white--text" >            
            <span class="headline">Список полей с датой</span>
            </v-card-title>
            <v-divider class="mx-0 primary" horizontal></v-divider>
            <v-card-text style="height: 190px;">
              <v-container fluid dense class="pa-0 ma-0" >
                <v-radio-group v-model="selectedDtField" column>
                  <v-radio class="pt-4"  v-for="(item,i) in lstDtFields" text :key="`radflds${i}`" dense 
                    :label=getFieldDescr(item) :value=item >
                    </v-radio>
                </v-radio-group>  
              </v-container>                    
            </v-card-text>
            <v-divider class="mx-0 primary" horizontal></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="primary white--text" @click="setDtField">Применить</v-btn>
              <v-btn   @click="closeDtDialog">Отмена</v-btn>            
            </v-card-actions>          
          </v-card>                    
        </v-dialog> 


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
                <v-flex sm10 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.group_name" label="Пользовательское наименование таблицы (группы параметров)"></v-text-field>
                </v-flex>
                <v-flex sm1 class="pr-1 pl-1">
                  <v-btn fab small color="primary" @click="getTableUserName()"><v-icon>{{icoQuest}}</v-icon></v-btn>
                </v-flex>
                <v-flex sm1 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.ext_code" label="Код пакета"></v-text-field>
                </v-flex>
                <v-flex sm11 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.tbl_name" label="Наименование таблицы для получения данных"></v-text-field>
                </v-flex>                
                <v-flex xs11 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.dt_field" label="Поле с датой"></v-text-field>
                </v-flex>
                <v-flex xs1 class="pr-1 pl-1">
                   <v-btn fab small color="primary" @click="getDtFields()"><v-icon>{{icoRadioList}}</v-icon></v-btn>
                </v-flex>
                <v-flex xs12 sm5 md4 class="pr-1 pl-1">
                  <v-checkbox v-model="editedItem.isdiscrete" label="Дискретные данные"></v-checkbox>
                </v-flex>
              </v-layout>
              <table-params-list :pTableId="this.selectedTableId" :pTableName="this.editedItem.tbl_name" @changedTableParams="changedTableParams" @changedTableParamsForRemove="changedTableParamsForRemove"></table-params-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-toolbar>
    
    <v-data-table :headers="headers" :items="tables" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.id }} </td>
        <td>{{ props.item.group_name }}</td>
        <td class="text-xs-left">{{ props.item.tbl_name }} </td>        
        <td class="text-xs-center">{{ props.item.ext_code }}</td>
        <td class="text-xs-center">{{ props.item.dt_field }}</td>
        <td class="text-xs-center">{{ props.item.isdiscrete }}</td>        
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getTablesFormSrv">Перезагрузить список</v-btn>
      </template>


    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">{{icoEdit}}</v-icon>
      <v-icon small @click="deleteItem(item)">{{icoDel}}</v-icon>
    </template>

    </v-data-table>

  </div>
</template>

<script>

import { mdiMagnify } from '@mdi/js'
import { mdiPlus } from '@mdi/js'
import { mdiPencil } from '@mdi/js'
import { mdiDelete } from '@mdi/js'
import { mdiClose } from '@mdi/js'
import { mdiFormatListBulleted } from '@mdi/js'
import { mdiCommentQuestion } from '@mdi/js';

import TableParamsList from '@/components/TableParamsList'
import TableParamsService from '@/services/TableParamsService'

export default {
    components: {
      TableParamsList,
    },
    data: () => ({
      selectedTableId: -1,
      dialog: false,
      search: null,
      icoSearch: mdiMagnify,
      icoAdd: mdiPlus,
      icoDel: mdiDelete,
      icoEdit: mdiPencil,
      icoClose: mdiClose,
      icoRadioList: mdiFormatListBulleted,
      icoQuest: mdiCommentQuestion,
      maskExtCode: "####",
      rowsPerPageItems: [/*25,50,*/{"text":"Все","value":-1}],
      headers: [
        {text: 'ID',align: 'left',sortable: true, value: 'id'},        
        { text: '', align: 'left',value: 'action', sortable: false },
        {text: 'Пользовательское наименование таблицы (группы параметров)',align: 'left',sortable: true, value: 'group_name'},        
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
      lstDelParams: [],
      lstParams: [],
      dialogDt: false,
      lstDtFields: [],
      selectedDtField: null,
      
    }),



    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Добавление таблицы' : 'Редактирование таблицы'
        },
        tables(){
            console.info('tables', this.$store.getters.getTables)
            return this.$store.getters.getTables
        },
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {
      /*
      dialogDt: false,
      lstDtFields: [],
      selectedDtField = null,
      */

      getFieldDescr(item){
        return item.column_name + " (" + item.column_comment + ") " + item.data_type
      },

      closeDtDialog(){
        this.dialogDt = false
        this.lstDtFields = []
        this.selectedDtField = null  
      },
      setDtField(){
        this.editedItem.dt_field = this.selectedDtField.column_name
        this.closeDtDialog()
      },
      getTableUserName(){
        console.log('getDtFields', this.editedItem.tbl_name)
        this.$store.commit('SET_PROCESSING',true)  
        this.$store.commit('SET_ERROR_CLEAN')  
        try{                      
          TableParamsService.getTableUserName(this.editedItem.tbl_name)
            .then(result => {      
                console.log('getTableUserName', result.data)
                this.$store.commit('SET_PROCESSING',false)   
                this.$store.commit('SET_MESSAGE',"Пользовательское наименование таблицы получено")
                if ((result.data)&&(result.data.length > 0)){
                  this.editedItem.group_name = result.data[0].obj_description  
                  this.editedItem.ext_code = result.data[0].ext_code
                }else{
                    alert('Не удалось получить пользовательское наимнование для таблицы "' + this.editedItem.tbl_name + '". ')
                }
              }
            )
            .catch(err => {                     
                this.$store.commit('SET_PROCESSING',false)     
                this.$store.commit('SET_ERROR',err)    
                console.info('getTableUserName 1', err)                     
                alert('Не удалось получить пользовательское наимнование для таблицы "' + this.editedItem.tbl_name + '". Ошибка: '+err)
              }
  
            )
        }catch(err){
          this.$store.commit('SET_PROCESSING',false)
          console.info('getTableUserName 2', err)            
          alert('Не удалось получить пользовательское наимнование для таблицы "' + this.editedItem.tbl_name + '". Ошибка: '+err)
        }        
      },

      getDtFields(){
          console.log('getDtFields', this.editedItem.tbl_name)
          this.fieldsList = []
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            TableParamsService.getTableFields(this.editedItem.tbl_name,true)
              .then(result => {      
                  console.log('getDtFields', result.data)
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Поля таблицы загружены")
                  if ((result.data)&&(result.data.length > 0)){
                    this.lstDtFields = result.data  
                    this.dialogDt = true
                  }else{
                      alert('Поля с датой для таблицы "' + this.editedItem.tbl_name + '" не найдены. ')
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)    
                  console.info('getDtFields3', err)                     
                  alert('Поля с датой для таблицы "' + this.editedItem.tbl_name + '" не найдены. Ошибка: '+err)
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('fieldsList4', err)            
            alert('Поля для таблицы "' + this.editedItem.tbl_name + '" не найдены. Ошибка: '+err)
          }
      },

      changedTableParams(event){
          this.lstParams = event
          //console.info('TablesList changedTableParams',this.lstParams)
      },
      changedTableParamsForRemove(event){
          this.lstDelParams = event
          //console.info('TablesList changedTableParamsForRemove',this.lstDelParams)
      },      

      getTablesFormSrv(){
        //console.info('TablesList', 'GET_TABLES_FROM_SRV')
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
        let payload = {table: this.editedItem, params: this.lstParams, delParams: this.lstDelParams}
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