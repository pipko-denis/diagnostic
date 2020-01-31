<template>
  <v-card>    
    <div class="headline">Список параметров</div>
    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" single-line hide-details></v-text-field>    
      <v-spacer></v-spacer>

      <v-tooltip>
        <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" @click="showMassDialog()" v-on="on"><v-icon>{{icoPickFields}}</v-icon></v-btn> 
        </template>
        <span>Показать список параметров</span>
      </v-tooltip> 

      <v-dialog v-model="dialogMassParams" scrollable  max-width="550px"> 
        <v-card tile>           
          <v-card-title class="primary white--text" >            
           <span class="headline">Массовое добавление параметров</span>
          </v-card-title>
          <v-divider class="mx-0 primary pa-0 ma-0" horizontal></v-divider> 
          <v-container fluid dense class="pb-0 ma-0">
            <v-select v-model="massSelectedTableId" :items="tables" item-value="id" label="Таблица" @change="getTableFields(massSelectedTableId)">
              <template slot="selection" slot-scope="data">
                {{ data.item.tbl_name }} ( {{ data.item.group_name }} )
              </template> 
              <template slot="item" slot-scope="data">
                {{ data.item.tbl_name }} ( {{ data.item.group_name }} )
              </template>  
            </v-select>      
            <v-checkbox dense height="1px" class="pt-0 pl-4 ma-0" label="Выбрать все" @change="checkAllFields()" v-model="massChecked"></v-checkbox>  
          </v-container>   


          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-text style="height: 300px;">
            <v-container fluid dense class=" ma-0">
              <v-checkbox class="pa-0 ma-0" v-for="(item,i) in fieldsList" text :key="`chfld${i}`" dense 
                 :label=getFieldDescr(item)
                 :value=item v-model="massSelectedFields">
                </v-checkbox>
              </v-container>                    
          </v-card-text>
<!--          
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <div dense class="pa-2 ma-0 blue-grey lighten-5" >
            <v-checkbox dense class="pt-5 ma-0" label="Дискретные данные" value="massIsDiscret"></v-checkbox>
            <v-text-field v-model="massExtraWhere" label="Дополнительное условие"></v-text-field>
          </div>  
-->          
          <v-divider class="mx-0 primary" horizontal></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="primary white--text" @click="massAddParams">Добавить параметры</v-btn>
            <v-btn   @click="closeMassDialog">Отмена</v-btn>            
          </v-card-actions>          
        </v-card>                    
      </v-dialog>



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

    <v-data-table :headers="headers" :items="diagParamsListForTable" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
        
      <template v-slot:item.min_acc_val="{ item }" >
        {{cutNines(item.min_acc_val)}}
      </template>  
      <template v-slot:item.acc_val="{ item }" >
        {{cutNines(item.acc_val)}}
      </template>
      <template v-slot:item.max_acc_val="{ item }" >
        {{cutNines(item.max_acc_val)}}
      </template>

      <template v-slot:item.coef_q="{ item }" >
        {{cutZeroes(item.coef_q)}}
      </template>
      <template v-slot:item.coef_a="{ item }" >
        {{cutZeroes(item.coef_a)}}
      </template>
      <template v-slot:item.coef_b="{ item }" >
        {{cutZeroes(item.coef_b)}}
      </template>
      <template v-slot:item.dim_id="{ item }" >
        {{getMeasUnit(item.dim_id) }}
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
    props: {
      pMachTypeId:{
          type: Number,
          required: true,          
      },
      pMachId:{
        type: Number,
        default: null,
      }
    },  
    data: () => ({
      search: '',  
      dialog: false,
      dialogMassParams: false,

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
        //{text: 'Ид. род.',align: 'left',sortable: true, value: 'diag_table_param_id'},
        {text: 'Наименование',align: 'left',sortable: true, value: 'name'},
        {text: 'Ед.изм.',align: 'left',sortable: true, value: 'dim_id'},
        {text: 'Разм.',align: 'left',sortable: true, value: 'presc'},
        {text: 'Коэф.q',align: 'left',sortable: true, value: 'coef_q'},
        {text: 'Коэф.a',align: 'left',sortable: true, value: 'coef_a'},
        {text: 'Коэф.b',align: 'left',sortable: true, value: 'coef_b'},
        {text: 'Миним. знач.',align: 'left',sortable: true, value: 'min_acc_val'},
        {text: 'Допуст. знач.',align: 'left',sortable: true, value: 'acc_val'},
        {text: 'Макс. знач.',align: 'left',sortable: true, value: 'max_acc_val'},        
        {text: 'Оповещ. превыш.',align: 'left',sortable: true, value: 'notify_over'},
        {text: 'Оповещ. низк.',align: 'left',sortable: true, value: 'notify_under'},
      ],    
      listDsParamType: [
                        {id: null, name: "не выбран"},
                        {id: 1, name: "температура"}, 
                        {id: 2, name: "давление"}, 
                        {id: 3, name: "напряжение"}
      ],
      
      editedIndex: -1,
      editedItem:  {id: null, tbl_name: null, field_name: null, name: null, dim_name_short: null, presc: null, coef_q: null, coef_a: null, coef_b: null,
                    min_acc_val: null,acc_val : null, max_acc_val: null, notify_over: null, notify_under: null},
      defaultItem: {id: null, tbl_name: null, field_name: null, name: null, dim_name_short: null, presc: null, coef_q: null, coef_a: 1.0, coef_b: null,
                    min_acc_val: -9999,acc_val : -9999, max_acc_val: -9999, notify_over: null, notify_under: null},
      lstParamsRemoveFromSrv: [],
      diagParamsList: [],
      massSelectedTableId: null,
      massSelectedFields: [],
      fieldsList: [],
      massChecked: false,
    }),

    computed: {
      tables(){
        //console.info('tables computed', this.$store.getters.getTables)
        return this.$store.getters.getTables
      },
      
      measUnits(){
        //console.info('tables computed', this.$store.getters.getTables)
        return this.$store.getters.getMeasUnits
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

      diagParamsListForTable(){
        this.$emit("changedMtDiagParams",this.diagParamsList)
        return this.diagParamsList
      },     
      
    },

    watch: {
      dialog (val) {
        val || this.close()
      },

      pMachTypeId: {
        immediate: true,
        handler: function(val,ov) {
          //console.info('WATCH pMachTypeId =' + val + ' old='+ov)
          if (val > 0){
            this.getParamsList()
          }else{
            this.diagParamsList = []          

          }
          this.fieldsList = []
          this.lstParamsRemoveFromSrv = []         
          this.$emit("changedMtDiagParamsForRemove",this.lstParamsRemoveFromSrv)          
        }
      }
      
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
      this.getTablesFormSrv()
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
        if (val == "-9999.0000"){ return 'нет'}
        else {return val} 
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
          this.diagParamsList = []
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            MachParamsService.getMachParams({machineid: this.pMachId,typeid: this.pMachTypeId},false)
              .then(result => {      
                  //console.log('getParamsList', result.data)
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Параметры для типа машины загружены")
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
                  console.info('diagParamsList3', err)                     
                  alert('Параметры для типа машины с ID = ' + this.pMachTypeId + ' не найдены. Ошибка: '+err)
                }
    
              )
          }catch(err){
            this.$store.commit('SET_PROCESSING',false)
            console.info('diagParamsList4', err)            
            alert('Параметры для типа машины с ID = ' + this.pMachTypeId + ' не найдены. Ошибка: '+err)
          }        
          
        },

      setAddDialog(){
        if (this.pMachTypeId) {
          this.editedItem = Object.assign({},this.defaultItem)
          this.editedItem.machine_id = this.pMachId
          this.editedItem.tip_id = this.pMachTypeId
          this.dialog = true
        }else {
          this.dialog = false
          alert('Необходимо выбрать элемент классификатора машин!') 
        }
      },

      removeParamFromMachType(item){
        if ((item)&&(item.id)){ 
          this.lstParamsRemoveFromSrv.push(item) 
          this.$emit("changedMtDiagParamsForRemove",this.lstParamsRemoveFromSrv)
        }
        const index = this.diagParamsList.indexOf(item)
        this.diagParamsList.splice(index, 1)
      },

      editMachTypeParam(item){
        if ((item)&&(item.id)){
          console.info('editMachTypeParam',item) 
        }else{
          console.info('editMachTypeParam', 'id is null')          
        }
      },

      editItem (item) {        
        if (this.pMachTypeId){
          this.editedIndex = this.diagParamsList.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.getTableFields(item.diag_table_id)
          this.dialog = true        
        }else{
          this.dialog = false
          alert('Необходимо выбрать таблицу')          
        }
        
      },

      deleteItem (item) {        
        if (confirm('Вы уверены что хотите удалить параметр "'+(item.descr || item.field_name)+'" из списка?')){
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
        /*
        if ((!this.editedItem)||(!this.editedItem.car_reg_number)){
          alert('Для сохранения вагона необходимо указать его регистрационный номер!')          
          return
        }
        */ 
        let elem = _.find(this.tables,{id: this.editedItem.diag_table_id})          
        this.editedItem.tbl_name = elem.tbl_name

        elem = _.find(this.fieldsList,{id: this.editedItem.diag_table_param_id})
        this.editedItem.field_name = elem.field_name



        console.log('save',this.editedItem)
        if (this.editedIndex > -1) {
          this.editedItem.tip_id = this.pMachTypeId
          //this.editItem(this.editedItem)
          Object.assign(this.diagParamsList[this.editedIndex], this.editedItem)
        } else {
          this.diagParamsList.push(this.editedItem)
          //this.createCarForTrain(this.editedItem)
        }
        //this.$emit("changedMtDiagParams",this.diagParamsList)

        this.close()
      },




    }

  }



</script>

<style scoped>

</style>


