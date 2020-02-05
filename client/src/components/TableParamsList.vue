<template>
  <v-card>    
    <div class="headline">Список параметров таблицы</div>
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>

      <v-tooltip>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" id="pTableId" @click="getFieldsList()" v-on="on"><v-icon>{{icoPeickFields}}</v-icon></v-btn> 
        </template>
        <span>Показать список полей</span>
      </v-tooltip> 

      <v-dialog v-model="dialogFields" scrollable  max-width="500px"> 
        <v-card tile>           
          <v-card-title class="primary white--text" >            
           <span class="headline">Список полей таблицы</span>
          </v-card-title>
          <v-divider class="mx-0 primary pa-0 ma-0" horizontal></v-divider> 
          <div dense class="pl-5 ma-0 blue-grey lighten-5">
            <v-checkbox height="1px" dense  label="Выбрать все" @change="checkAllFields()" v-model="massChecked"></v-checkbox>
          </div>  
          <!--<v-divider class="mx-0 primary" horizontal></v-divider>-->
          <v-card-text style="height: 300px;">
            <v-container fluid dense class=" ma-0">
              <v-checkbox class="pa-0 ma-0" v-for="(item,i) in fieldsListFitered" text :key="`chfld${i}`" dense 
                 :label=getFieldDescr(item)
                 :value=item v-model="selectedFields">
                </v-checkbox>
              </v-container>                    
          </v-card-text>
          <!--<v-divider class="mx-0 primary" horizontal></v-divider>-->
          <div dense class="pa-2 ma-0 blue-grey lighten-5" >
            <v-checkbox dense class="pt-5 ma-0" label="Дискретные данные" value="massIsDiscret"></v-checkbox>
            <v-text-field v-model="massExtraWhere" label="Дополнительное условие"></v-text-field>
          </div>  
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" @click="addFields">Добавить поля</v-btn>
            <v-btn   @click="closeFieldsDialog">Отмена</v-btn>            
          </v-card-actions>          
        </v-card>                    
      </v-dialog>


      <v-tooltip>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" id="pTableId" @click="getParamsList()" v-on="on"><v-icon>{{icoRefresh}}</v-icon></v-btn> 
        </template>
        <span>Перезагрузить cписок</span>
      </v-tooltip> 

      <v-tooltip>
        <template v-slot:activator="{ on }">
          <v-btn fab small color="primary" class="mb-2" @click="setAddDialog" v-on="on"><v-icon>{{icoAdd}}</v-icon></v-btn>   <!--:disabled="!getProcessing && !getIsTrainSelected"-->
        </template>
        <span>Добавить параметр таблицы</span>
      </v-tooltip> 

      <v-dialog v-model="dialog" persistent max-width="500px">        
                 
        <v-card>           
         <v-card-title class="primary white--text" >            
           <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider class="mx-0 primary" horizontal></v-divider> 
        <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex sm4 class="pr-1 pl-1" >
                  <v-text-field readonly v-model="editedItem.id" label="ID"></v-text-field>
                </v-flex>  
                <v-flex sm4 class="pr-1 pl-1" >
                  <v-text-field readonly v-model="editedItem.diag_table_id" label="ID таблицы"></v-text-field>
                </v-flex>  
                <v-flex xs4 sm6 md4 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.ext_param" label="Код параметра"></v-text-field>
                </v-flex>                
                <v-flex sm12 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.descr" label="Описание параметра"></v-text-field>
                </v-flex>
                <v-flex sm12 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.field_name" label="Название поля"></v-text-field>
                </v-flex>
                <v-flex sm12 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.extra_where" label="Дополнительное условие"></v-text-field>
                </v-flex>                
                <v-flex xs6 class="pr-1 pl-1">
                  <v-select v-model="editedItem.ds_param_type" :items="listDsParamType" item-text="name" item-value="id" label="Тип параметра доверенной среды:"></v-select>
                </v-flex>
                <v-flex xs6 class="pr-1 pl-1">
                  <v-checkbox v-model="editedItem.isdiscrete" label="Дискретные данные"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
        </v-card-text>
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" @click="save">Сохранить</v-btn>
            <v-btn   @click="close">Отмена</v-btn>            
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="tableParams" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
        
      <template v-slot:item.ds_param_type="{ item }" >
        {{getDsParamTypeById(item.ds_param_type)}}
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="getParamsList">Перезагрузить список</v-btn>
      </template>


    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">{{icoEdit}}</v-icon>
      <v-icon small @click="deleteItem(item)">{{icoDel}}</v-icon>
    </template>


    </v-data-table>
  </v-card>
</template>


<script>

import TableParamsService from '@/services/TableParamsService'
import { mdiMagnify } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiClose } from '@mdi/js';
import { mdiRefresh } from '@mdi/js';
import { mdiCheckboxMultipleMarkedOutline } from '@mdi/js';

  export default {

    components:{
      TableParamsService,
    },

    props: {
      pTableId:{
          type: Number,
          required: true
      },
      pTableName:{
          type: String,
          default: '',
      }
    },  

    

    data: () => ({
      search: '',  
      dialog: false,
      dialogFields: false,
      icoSearch: mdiMagnify,
      icoAdd: mdiPlus,
      icoDel: mdiDelete,
      icoEdit: mdiPencil,
      icoClose: mdiClose, 
      icoRefresh: mdiRefresh,   
      icoPeickFields: mdiCheckboxMultipleMarkedOutline,   
      headers: [
        {text: 'Id',align: 'left',sortable: true, value: 'id'},        
        { text: '', align: 'left',value: 'action', sortable: false },
        {text: 'Описание параметра',align: 'left',sortable: true, value: 'descr'},        
        //{ text: 'ID таблицы', align: 'left',value: 'diag_table_id' },
        { text: 'Название поля', align: 'left',value: 'field_name' },
        { text: 'Дополнительное условие', align: 'left',value: 'extra_where' },
        { text: 'Код параметра', align: 'left',value: 'ext_param' },
        { text: 'Тип для ДС', align: 'left',value: 'ds_param_type' },
        { text: 'Дискрет.', align: 'left',value: 'isdiscrete' },
      ],    
      listDsParamType: [
                        {id: null, name: "не выбран"},
                        {id: 1, name: "температура"}, 
                        {id: 2, name: "давление"}, 
                        {id: 3, name: "напряжение"}
      ],
      
      editedIndex: -1,
      editedItem: {id: null, descr: null, field_name: null, extra_where: null, ext_param: null, ds_param_type: null, isdiscrete: null},
      defaultItem: {id: null, descr: null, field_name: null, extra_where: null, ext_param: null, ds_param_type: null, isdiscrete: null},
      paramsList: [],
      lstParamsRemoveFromSrv: [],
      fieldsList: [],
      selectedFields: [],
      massExtraWhere: null,
      massIsDiscret: false,
      massChecked: false,
    }),

    computed: {

      fieldsListFitered(){
        var that = this
        return _.filter(this.fieldsList, function(item){
          //console.info('fieldsListFitered this.tableParams', that.tableParams)
          //return item.column_name !== _.find(that.tableParams,{field_name: item.column_name})
          if (_.find(that.tableParams,{field_name: item.column_name})) {return false}
          else {return true}
          //return _.find(this.paramsList,{field_name: item.column_name}) > 0
        })
      },

      formTitle () {
        return this.editedIndex === -1 ? 'Добавление параметра' : 'Редактирование параметра'
      },
      isEditDialod () {
        return this.editedIndex === -1 ? false : true
      },
      
      getProcessing(){   
        return this.$store.getters.getProcessing
      },

      tableParams(){          
        //console.log('computed tableParams', this.paramsList)
        this.$emit("changedTableParams",this.paramsList)
        return this.paramsList
      },  

    },

    mounted() {
      this.paramsList = []
    },

    watch: {
      dialog (val) {
        val || this.close()
      },

      pTableName(val){
        if (!val) {
          this.paramsList = []
        }
      },

      pTableId: { 
        immediate: true,
        handler: function(val,ov) {
          //console.info('WATCH pMachTypeId =' + val + ' old='+ov)
        console.info('watch pTableId =' + val + ' old='+ov)
        this.paramsList = []
        if (val > 0){
          this.getParamsList()
        }

        this.lstParamsRemoveFromSrv = [] 
        this.$emit("changedTableParamsForRemove",this.lstParamsRemoveFromSrv)     
        }
      },

/*
      pTableId(val){
        console.info('watch pTableId', val)
        if (val > 0){
          this.getParamsList()
        }else{
          this.paramsList = []
        }

        this.lstParamsRemoveFromSrv = [] 
        this.$emit("changedTableParamsForRemove",this.lstParamsRemoveFromSrv)
      }
*/      
    },


    methods: {

      getFieldDescr(item){
        return item.column_name + " (" + item.column_comment + ") " + item.data_type
      },

      checkAllFields(){
        if (this.massChecked) {
          this.selectedFields = this.fieldsListFitered.slice();
        } else{
          this.selectedFields = []
        }
      },

      getDsParamTypeById(id){           
        let elem = _.find(this.listDsParamType,{id:id})
        if (elem) return elem.name 
        else return null        
      },

/*
        changedLstParams(event){
            this.train_number = event
            this.$emit("changedLstParams",this.paramsList)
        },

        changedLstDelParams(event){
            this.train_number = event
            this.$emit("changedLstDelParams",this.lstParamsRemoveFromSrv)
        },
*/

        getFieldsList(){
          console.log('getFieldsList', this.pTableName)
          this.fieldsList = []
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            TableParamsService.getTableFields(this.pTableName,false)
              .then(result => {      
                  console.log('fieldsList', result.data)
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Поля таблицы загружены")
                  if ((result.data)&&(result.data.length > 0)){
                    this.fieldsList = result.data  
                    this.dialogFields = true
                  }else{
                      alert('Поля для таблицы "' + this.pTableName + '" не найдены. ')
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)    
                  console.info('fieldsList3', err)                     
                  alert('Поля для таблицы "' + this.pTableName + '" не найдены. Ошибка: '+err)
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('fieldsList4', err)            
            alert('Поля для таблицы "' + this.pTableName + '" не найдены. Ошибка: '+err)
          }        
          
        },


        getParamsList(){
          this.paramsList = []
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            TableParamsService.getTableParams(this.pTableId)
              .then(result => {      
                  //console.log('getParamsList', result.data,this.pTableId)
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Параметры таблицы загружены")
                  this.paramsList = result.data  
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)    
                  console.info('paramsList3', err)                     
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('paramsList4', err)            
          }        
          
          
      },      


      setAddDialog(){
        if (this.pTableId) {
          this.editedItem = Object.assign({},this.defaultItem)
          this.editedItem.diag_table_id = this.pTableId
          this.dialog = true
        }else {
          this.dialog = false
          alert('Необходимо выбрать диагностическую таблицу') 
        }
      },

      removeParamFromTable(item){
        if ((item)&&(item.id)){ 
          this.lstParamsRemoveFromSrv.push(item) 
          this.$emit("changedTableParamsForRemove",this.lstParamsRemoveFromSrv)
        }
        const index = this.paramsList.indexOf(item)
        this.paramsList.splice(index, 1)
      },

      editTableParam(item){
        if ((item)&&(item.id)){
          console.info('editTableParam',item) 
        }else{
          console.info('editTableParam', 'id is null')          
        }
      },

      editItem (item) {        
        if (this.pTableId){
          this.editedIndex = this.tableParams.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true        
        }else{
          this.dialog = false
          alert('Необходимо выбрать таблицу')          
        }
        
      },

      deleteItem (item) {        
        if (confirm('Вы уверены что хотите удалить параметр "'+(item.descr || item.field_name)+'" из списка?')){
          this.removeParamFromTable(item)
        }         
      },

      closeFieldsDialog(){
        this.dialogFields = false
        this.massIsDiscret = false
        this.selectedFields = []
        this.massExtraWhere = null
        /*
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          //this.editedItem.diag_table_id = this.pTableId
          this.editedIndex = -1
        }, 300)
        */
      },

      addFields(){
        console.log('addFields', this.selectedFields)
        //console.log('massExtraWhere', this.massExtraWhere)
        var addCode = (this.paramsList.length == 0)
        var inc = 1
        this.selectedFields.forEach(field => {
          var newParam = Object.assign({},this.defaultItem)
          newParam.diag_table_id = this.pTableId
          newParam.field_name = field.column_name
          newParam.descr = field.column_comment
          if (addCode){
            newParam.ext_param = inc
            inc++
          }
          newParam.extra_where  = this.massExtraWhere
          newParam.isdiscrete  = this.massIsDiscret
          this.paramsList.push(newParam)
        });
        this.closeFieldsDialog()        
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          //this.editedItem.diag_table_id = this.pTableId
          this.editedIndex = -1
        }, 300)
      },

      save () {
        /*
        if ((!this.editedItem)||(!this.editedItem.car_reg_number)){
          alert('Для сохранения вагона необходимо указать его регистрационный номер!')          
          return
        }
        */ 
        //console.log('save',this.editedItem)
        if (this.editedIndex > -1) {
          //this.editItem(this.editedItem)
          Object.assign(this.tableParams[this.editedIndex], this.editedItem)
          
        } else {
          this.tableParams.push(this.editedItem)
          //this.createCarForTrain(this.editedItem)
        }

        this.close()
      },


    }
  }



</script>

<style scoped>

</style>


