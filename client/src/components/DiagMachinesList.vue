<template>
  <v-card>    
    <div class="headline">Список параметров </div>
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>

      <v-tooltip>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" @click="getParamsList()" v-on="on"><v-icon>{{icoRefresh}}</v-icon></v-btn> 
        </template>
        <span>Перезагрузить cписок</span>
      </v-tooltip> 

      <v-tooltip>
        <template v-slot:activator="{ on }">
          <v-btn fab small color="primary" class="mb-2" @click="setAddDialog" v-on="on"><v-icon>{{icoAdd}}</v-icon></v-btn>   <!--:disabled="!getProcessing && !getIsTrainSelected"-->
        </template>
        <span>Добавить параметр таблицы</span>
      </v-tooltip> 

      <v-dialog v-model="dialog" persistent max-width="600px"  class="ma-0">        
                 
        <v-card >           
         <v-card-title class="primary white--text" >            
           <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider class="mx-0 primary" horizontal></v-divider> 
        <v-card-text class="pa-0 ma-0">          

            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex sm2 class="pr-1 pl-1" >
                  <v-text-field readonly v-model="editedItem.id" label="ID"></v-text-field>
                </v-flex>  
                <v-flex sm10 class="pr-1 pl-1">
                  <v-text-field v-model="editedItem.name" label="Наименование параметра"></v-text-field>
                </v-flex>

                <v-flex sm12 class="pr-1 pl-1">
                    <v-autocomplete v-model="editedItem.tip_id" :items="compMachTypes" label="Тип СПС" item-value="id" item-text="full_name"  @change="curMachType = editedItem.tip_id"   clearable >
                      <template slot="selection" slot-scope="data">
                        {{ data.item.full_name }}
                      </template> 
                      <template slot="item" slot-scope="data">
                        {{ data.item.full_name }}
                      </template>  
                    </v-autocomplete>
                </v-flex>                

                <v-flex sm12 class="pr-1 pl-1">
                    <v-autocomplete v-model="editedItem.machine_id" :items="compMachinesByType" label="Наименование СПС" item-value="id" item-text="zav_nomer"  clearable >
                      <template slot="selection" slot-scope="data">
                        Id:{{ data.item.id }}; заводской №:{{ data.item.zav_nomer }} ({{data.item.shortname}})
                      </template> 
                      <template slot="item" slot-scope="data">
                        Id:{{ data.item.id }}; заводской №{{ data.item.zav_nomer }} ({{data.item.shortname}})
                      </template>  
                    </v-autocomplete>
                </v-flex>               

                <v-flex sm12 class="pr-1 pl-1">
                  <v-expansion-panels focusable>
                    <v-expansion-panel>
                      <v-expansion-panel-header>Источник данных параметра</v-expansion-panel-header>
                      <v-expansion-panel-content>

                        <v-flex sm12 class="pr-1 pl-1">
                          <v-select v-model="editedItem.diag_table_id" :items="tables" item-value="id" label="Таблица" @change="getTableFields(editedItem.diag_table_id)">
                            <template slot="selection" slot-scope="data">
                              {{ data.item.tbl_name }} ( {{ data.item.group_name }} )
                            </template> 
                            <template slot="item" slot-scope="data">
                              {{ data.item.tbl_name }} ( {{ data.item.group_name }} )
                            </template>  
                          </v-select>        
                        </v-flex>                 

                        <v-flex sm12 class="pr-1 pl-1">
                          <v-select v-model="editedItem.diag_table_param_id" :items="fieldsList" item-value="id" label="Параметр" @change="updateEditItemName()">
                            <template slot="selection" slot-scope="data">
                              {{ data.item.field_name }} ( {{ data.item.descr }} )
                            </template> 
                            <template slot="item" slot-scope="data">
                              {{ data.item.field_name }} ( {{ data.item.descr }} )
                            </template>  
                          </v-select>
                        </v-flex> 
<!--  
                        <v-btn fab small color="primary" @click="getTableFields"><v-icon>{{icoRefresh}}</v-icon></v-btn> 

                        <v-flex sm12 class="pr-1 pl-1">
                          <v-text-field v-model="editedItem.diag_table_param_id" label="Идентификатор из askr_diag_table_param"></v-text-field>
                        </v-flex>     
                              
                        <v-flex sm12 class="pr-1 pl-1" >
                          <v-text-field readonly v-model="editedItem.tip_id" label="Идентификатор типа машины из spr_machine_type"></v-text-field>
                        </v-flex>                                         
-->
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>Коэффициенты для пересчета по формуле (qx2+ax+b)</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-layout wrap>
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.coef_q" label="Коэффициент 'q'"></v-text-field>
                          </v-flex>
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.coef_a" label="Коэффициент 'a'"></v-text-field>
                          </v-flex>            
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.coef_b" label="Коэффициент 'b'"></v-text-field>
                          </v-flex>  
                        </v-layout>  
                      </v-expansion-panel-content>
                    </v-expansion-panel>   

                    <v-expansion-panel>
                      <v-expansion-panel-header>Параметры отображения графика</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-layout wrap>
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.min_acc_val" label="Минимальное"></v-text-field>
                          </v-flex>                                  
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.acc_val" label="Допустимое"></v-text-field>
                          </v-flex>                  
                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.max_acc_val" label="Максимальное"></v-text-field>
                          </v-flex>  

                          <v-flex sm8 class="pr-1 pl-1">
                            <!--<v-text-field v-model="editedItem.dim_id" label="Идентификатор ед. изм. из askr_diag_dim"></v-text-field>-->
                            <v-select v-model="editedItem.dim_id" :items="measUnits" item-value="id" label="Единицы измерения" clearable>
                              <template slot="selection" slot-scope="data">
                                {{ data.item.dim_name }} ( {{ data.item.dim_name_short }} )
                              </template> 
                              <template slot="item" slot-scope="data">
                                {{ data.item.dim_name }} ( {{ data.item.dim_name_short }} )
                              </template>  
                            </v-select>
                          </v-flex>

                          <v-flex sm4 class="pr-1 pl-1">
                            <v-text-field v-model="editedItem.presc" label="Размерность параметра"></v-text-field>
                          </v-flex>
                        </v-layout>  
                      </v-expansion-panel-content>
                    </v-expansion-panel>   

                    <v-expansion-panel>
                      <v-expansion-panel-header>Обмен данными</v-expansion-panel-header>
                      <v-expansion-panel-content>

                        <v-flex xs12 class="pr-1 pl-1">
                          <v-checkbox v-model="editedItem.notify_over" label='Флаг "Оповещать АСУ СПС при привышении значения указанного в поле "max_acc_val""'></v-checkbox>
                        </v-flex>
                        <v-flex xs12 class="pr-1 pl-1">
                          <v-checkbox v-model="editedItem.notify_under" label='Флаг "Оповещать АСУ СПС при значении более низком чем указано в поле "min_acc_val""'></v-checkbox>
                        </v-flex>

                      </v-expansion-panel-content>
                    </v-expansion-panel>     

                    <v-flex sm12 class="pr-1 pl-1">
                      <v-textarea v-model="editedItem.description" label="Описание"></v-textarea>
                    </v-flex>                                       

                  </v-expansion-panels>
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

    <v-data-table :headers="headers" :items="compDiagParamsList" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
      <template v-slot:item.all_acc_val="{ item }" >
        {{cutZeroesAndNines(item.min_acc_val)+"/"+cutZeroesAndNines(item.acc_val)+"/"+cutZeroesAndNines(item.max_acc_val)}}
      </template>
      <template v-slot:item.coef_q_a_b="{ item }" >
        {{cutZeroes(item.coef_q)+"/"+cutZeroes(item.coef_a)+"/"+cutZeroes(item.coef_b)}}
      </template>     
<!--
      <template v-slot:item.coef_a="{ item }" >
        {{cutZeroes(item.coef_a)}}
      </template>

      <template v-slot:item.min_acc_val="{ item }" >
        {{cutNines(item.min_acc_val)}}
      </template>  
      <template v-slot:item.dim_id="{ item }" >
        {{getMeasUnit(item.dim_id) }}
      </template>
-->
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

import MachParamsService from '@/services/MachParamsService'
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
      MachParamsService,
      TableParamsService,
    },
/*
    created(){
      this.pMachTypeId = -1
    },
*/
    data: () => ({
      search: '',  
      dialog: false,

      icoSearch: mdiMagnify,
      icoAdd: mdiPlus,
      icoDel: mdiDelete,
      icoEdit: mdiPencil,
      icoClose: mdiClose, 
      icoRefresh: mdiRefresh,   
      icoPickFields: mdiCheckboxMultipleMarkedOutline,   

      headers: [
        {text: 'ID',align: 'left',sortable: true, value: 'id'},        
        {text: '', align: 'left',value: 'action', sortable: false },
        {text: 'Таблица',align: 'left',sortable: true, value: 'tbl_name'},
        {text: 'Поле',align: 'left',sortable: true, value: 'field_name'}, 
        {text: 'Код таблицы',align: 'left',sortable: true, value: 'ext_code'}, 
        {text: 'Код параметра',align: 'left',sortable: true, value: 'ext_param'},        
        //{text: 'Ид. род.',align: 'left',sortable: true, value: 'diag_table_param_id'},
        {text: 'Наименование',align: 'left',sortable: true, value: 'name'},                
        {text: 'Машина или Тип',align: 'left',sortable: true, value: 'machine_or_tip_name'},
        {text: 'ID СПС',align: 'left',sortable: true, value: 'machine_id'},
        {text: 'ID Типа',align: 'left',sortable: true, value: 'tip_id'},        
        {text: 'Коэф.q/a/b',align: 'left',sortable: true, value: 'coef_q_a_b'},        
        {text: 'Допустимые значения',align: 'left',sortable: true, value: 'all_acc_val'},
        /*
        {text: 'Коэф.q',align: 'left',sortable: true, value: 'coef_q'},
        {text: 'Коэф.a',align: 'left',sortable: true, value: 'coef_a'},
        {text: 'Коэф.b',align: 'left',sortable: true, value: 'coef_b'},        
        {text: 'Разм.',align: 'left',sortable: true, value: 'presc'},
        {text: 'Ед.изм.',align: 'left',sortable: true, value: 'dim_id'},
        {text: 'Миним. знач.',align: 'left',sortable: true, value: 'min_acc_val'},
        {text: 'Допуст. знач.',align: 'left',sortable: true, value: 'acc_val'},
        {text: 'Макс. знач.',align: 'left',sortable: true, value: 'max_acc_val'},        
        {text: 'Оповещ. превыш.',align: 'left',sortable: true, value: 'notify_over'},
        {text: 'Оповещ. низк.',align: 'left',sortable: true, value: 'notify_under'},
        */
      ],    
      listDsParamType: [
                        {id: null, name: "не выбран"},
                        {id: 1, name: "температура"}, 
                        {id: 2, name: "давление"}, 
                        {id: 3, name: "напряжение"}
      ],
      
      editedIndex: -1,
      editedItem:  {id: null, tbl_name: null, field_name: null, name: null, dim_name_short: null, presc: null, coef_q: null, coef_a: null, coef_b: null,
                    min_acc_val: null,acc_val : null, max_acc_val: null, notify_over: null, notify_under: null, tip_id: null, machine_id: null
                    ,diag_table_id : null, diag_table_param_id : null,dim_id: null, description: null, ext_code: null, ext_param: null,machine_or_tip_name: null},
      defaultItem: {id: null, tbl_name: null, field_name: null, name: null, dim_name_short: null, presc: null, coef_q: null, coef_a: 1.0, coef_b: null,
                    min_acc_val: -9999,acc_val : -9999, max_acc_val: -9999, notify_over: null, notify_under: null, tip_id: null, machine_id: null
                    ,diag_table_id : null, diag_table_param_id : null,dim_id: null, description: null, ext_code: null, ext_param: null,machine_or_tip_name: null},

      //diagParamsList: [],      
      fieldsList: [],

      massChecked: false,
      curMachType:null,
    }),

    computed: {
      tables(){
        //console.info('tables computed', this.$store.getters.getTables)
        return this.$store.getters.getTables
      },
      
      measUnits(){      
        if (Array.isArray(this.$store.getters.getMeasUnits) && (this.$store.getters.getMeasUnits.length == 0)) {
          this.$store.dispatch('GET_MEAS_UNITS')
        }
        return this.$store.getters.getMeasUnits
      },

      machTypes(){
        return this.$store.getters.getMachTypes
      },   
       
      compMachinesByType(){        
        //console.info(this.$store.getters.getMachines)
        //console.info(_.filter(this.$store.getters.getMachines ,{tip: this.curMachType}))
        return _.filter(this.$store.getters.getMachines ,{tip: this.curMachType}) 
        //return this.$store.getters.machinesList
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

      compMachTypes() {
        var result = []
        this.machTypes.forEach(element => { 
          if (element.modification)
            element.full_name = element.id + ": " + element.type+"-"+element.modification;
          else   
            element.full_name = element.id + ": " + element.type;
          result.push(element);
        });
        //console.log('compMachTypes', result)
        return result;
      },

      compDiagParamsList(){
        console.log('compDiagParamsList', this.$store.getters.getDiagMachParams)
         return this.$store.getters.getDiagMachParams //getMachParams //GET_DIAG_MACH_PARAM
      },
/*
      diagParamsListForTable(){
        this.$emit("changedMtDiagParams",this.diagParamsList)
        return this.diagParamsList
      },     
*/      
    },

    watch: {
      dialog (val) {
        val || this.close()
      },

      
/*
      editedItem(val){
        console.log('editedItem val=',val.diag_table_id)
        if (val.diag_table_id){
          this.getTableFields(val.diag_table_id)
        }else{
          this.fieldsList = []
        }
      }
*/
    },

    mounted() {
      //console.info("DiagParamsList MOUNTED!!!!!")
      this.getParamsList();
      this.getTablesFormSrv()
      if (!this.$store.getters.getMachTypes){
        this.getMachTypesFormSrv()
      }      
      if (!this.$store.getters.getMachines){
        this.getMachinesFormSrv();
      }
    },

    methods: {

      showMassDialog(){
        this.dialogMassParams = true
      },
      closeMassDialog(){
        this.massSelectedTableId = null
        this.massSelectedFields = []  
        this.massChecked = false
        this.dialogMassParams = false
      },
/*      
      massAddParams(){

        var tbl = _.find(this.tables,{id: this.massSelectedTableId})

        this.massSelectedFields.forEach(param => {
          var newItem = Object.assign({},this.defaultItem) 
          newItem.tip_id = this.pMachTypeId
          newItem.machine_id = this.pMachId
          newItem.name = param.descr
          if (tbl) {newItem.tbl_name = tbl.tbl_name}
          
          newItem.field_name = param.field_name
          newItem.diag_table_id = param.diag_table_id
          newItem.diag_table_param_id = param.id
          this.diagParamsList.push(newItem)
        })
        console.log(this.diagParamsList, this.massSelectedFields)
        this.closeMassDialog()
      },
      checkAllFields(){
        if (this.massChecked) {
          this.massSelectedFields = this.fieldsList.slice();
        } else{
          this.massSelectedFields = []
        }
      },
*/
      getTablesFormSrv(){
        //console.info('METHOD getTablesFormSrv')
        this.$store.dispatch('GET_TABLES_FROM_SRV')            
      },      

      getFieldDescr(item){
        //console.log('Field descr', item)
        return item.field_name + " (" + item.descr + ") " + (item.extra_where || "")
      },

      cutZeroes(val){
        //console.log("cutZeroes",val)
        if (val == null) return null
        else {
          var valStr = val.toString()         
          if (isNaN(valStr)) {
            return null
          }else if (valStr.includes('.')){
              return valStr.replace(/0*$/,"")+"0"
            }else{
              return valStr+".0"
            }          
        }
      },

      getMeasUnit(val){        
        let elem = _.find(this.measUnits,{id:val})
        //console.info('getMeasUnit'+val, elem)
        if (elem) return elem.dim_name_short ||  elem.dim_name
        else return null    
      },

      cutNines(val){
        if (! val) return ""
        else if (val == "-9999.0000"){ return 'нет'}
        else if (val.toString() == "0.00000000"){ return '0.0'}
        else {return val} 
      },


      cutZeroesAndNines(val){
        //console.log("cutZeroes",val)
        var valWoNines = this.cutNines(val);

        if (valWoNines == null) return ''
        else {
          var valStr = valWoNines.toString()         
          if (isNaN(valStr)) {
            return null
          }else if (valStr.includes('.')){
              return valStr.replace(/0*$/,"")+"0"
            }else{
              return valStr+".0"
            }          
        }
      },      

      getDsParamTypeById(id){           
        let elem = _.find(this.listDsParamType,{id:id})
        if (elem) return elem.name 
        else return null        
      },

      updateEditItemName(){
        if (this.editedItem.name == null) {
          let elem = _.find(this.fieldsList,{id: this.editedItem.diag_table_param_id})
          //console.info('updateEditItemName '+this.editedItem.diag_table_param_id, elem)
          this.editedItem.name = elem.descr
        }
      },

      getMachinesByType(type_id){
        this.curMachType = type_id
        console.log(type_id)
      },

      getTableFields(diag_table_id){          
          console.info('getTableFields for ' + diag_table_id) 
          this.fieldsList = []

          if (!diag_table_id) return
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          //console.log('getTableFields', this.editedItem)//.diag_table_param_id)
          try{                      
            TableParamsService.getTableParams(diag_table_id)
              .then(result => {      
                  
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Параметры таблицы загружены")
                  this.fieldsList = result.data  
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

        getParamsList(){
          this.$store.dispatch('GET_DIAG_MACH_PARAMETERS')
        },
/*          this.diagParamsList = []
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            MachParamsService.getMachParamsAll()
              .then(result => {      
                  //console.log('getParamsList', result.data)
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Параметры для типа машины загружены")
                  //console.log('getParamsList', result.data)
                  if ((result.data)&&(result.data.length > 0)){
                    this.diagParamsList = result.data                      
                  }else{
                      //console.log('Параметры для типа машины с ID = ' + this.pMachTypeId + ' не найдены. ')
                      this.diagParamsList = []
                  }
                }
              )
              .catch(err => {                     
                  this.$store.commit('SET_PROCESSING',false)     
                  this.$store.commit('SET_ERROR',err)    
                  console.info('getMachParamsAll', err)                     
                  alert('Не удалось загрузить список всех параметров. Ошибка: '+err)
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('diagParamsList4', err)            
            alert('Параметры для типа машины с ID = ' + this.pMachTypeId + ' не найдены. Ошибка: '+err)
          }        
          
        },
*/
      setAddDialog(){
          //console.log('setAddDialog', this.$store.getters.getDiagMachParams)
          this.editedItem = Object.assign({},this.defaultItem)
          this.dialog = true
      },

     getMachTypesFormSrv(){
        //console.info('MachTypesList', 'GET_SPR_MACH_TYPES_FROM_SRV')
        this.$store.dispatch('GET_SPR_MACH_TYPES_FROM_SRV')            
      },      

      getMachinesFormSrv(){
        console.info('getMachinesFormSrv', 'GET_SPR_MACHINES_FROM_SRV')
        this.$store.dispatch('GET_SPR_MACHINES_FROM_SRV')
      },

      removeParamFromMachType(item){
        if ((item)&&(item.id)){           
          this.$store.dispatch('DEL_DIAG_MACH_PARAMETER',item)          
          //this.lstParamsRemoveFromSrv.push(item) 
          //this.$emit("changedMtDiagParamsForRemove",this.lstParamsRemoveFromSrv)
        } else {
          //const index = this.compDiagParamsList.indexOf(item)
          //this.compDiagParamsList.splice(index, 1)
          this.$store.commit('DEL_DIAG_MACH_PARAMETER',item)

        }
      },

      editMachTypeParam(item){
        if ((item)&&(item.id)){
          console.info('editMachTypeParam',item) 
        }else{
          console.info('editMachTypeParam', 'id is null')          
        }
      },

      editItem (item) {        
          this.curMachType = item.tip_id
          //console.log("Type", item)
          this.editedIndex = this.compDiagParamsList.indexOf(item)
          this.editedItem = Object.assign({}, item)          
          this.getTableFields(item.diag_table_id)          
          this.dialog = true                
      },

      deleteItem (item) {        
        if (confirm('Вы уверены что хотите удалить параметр "'+(item.descr || item.field_name) + '" ID = '+item.id+' из списка?')){
            this.removeParamFromMachType(item)
        }         
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          //this.editedItem.diag_table_id = this.pMachTypeId
          this.editedIndex = -1
        }, 300)
      },

      save () {
        
        if (!this.editedItem){
          alert('Не удалось получить объект для сохранения!')          
          return
        }

        if (!this.editedItem.tip_id){
          alert('Для сохранения вагона необходимо указать тип СПС!')          
          return
        }

        if ((!this.editedItem)||(!this.editedItem.diag_table_id)){
          alert('Для сохранения вагона необходимо указать таблицу!')          
          return
        }

        if ((!this.editedItem)||(!this.editedItem.diag_table_param_id)){
          alert('Для сохранения вагона необходимо указать параметр таблицы!')          
          return
        }
         

        let elem = _.find(this.compMachTypes,{id: this.editedItem.tip_id})          
        //console.log(this.compMachTypes, this.editedItem.tip_id, elem)
        this.editedItem.machine_or_tip_name = elem.type + " " + elem.modification

        if ( this.editedItem.machine_id ){          
          elem = _.find(this.compMachinesByType,{id: this.editedItem.machine_id})          
          //console.log(this.compMachinesByType, this.editedItem.machine_id, elem)
          this.editedItem.machine_or_tip_name += " №"+elem.zav_nomer+" ("+elem.cur_imei+")"
        }

        elem = _.find(this.tables,{id: this.editedItem.diag_table_id})          
        if (elem) {
          this.editedItem.tbl_name = elem.tbl_name
          this.editedItem.ext_code = elem.ext_code
        }

        elem = _.find(this.fieldsList,{id: this.editedItem.diag_table_param_id})
        if (elem) {
          this.editedItem.field_name = elem.field_name
          this.editedItem.ext_param = elem.ext_param
        }

        elem = _.find(this.measUnits,{id: this.editedItem.dim_id})
        //console.log(elem)
        if (elem) this.editedItem.dim_name_short = elem.dim_name_short
        else this.editedItem.dim_name_short = ""
    
        /*
        console.log('save',this.editedItem)
        if (this.editedIndex > -1) {
          Object.assign(this.diagParamsList[this.editedIndex], this.editedItem)
        } else {
          this.diagParamsList.push(this.editedItem)

        }
        */
        this.$store.dispatch('SAVE_DIAG_MACH_TYPE_PARAM',this.editedItem) 
        //MachParamsService.saveParam(this.editedItem);

        this.close()
      },




    }

  }



</script>

<style scoped>

</style>


