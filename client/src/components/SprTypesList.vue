<template>
  <div v-if="this.$store.getters.getIsAuth"> 
    <h1>Список типов машин</h1>

    <v-toolbar flat color="white">      
      <v-text-field v-model="search" :append-icon=icoSearch label="Поиск" clearable single-line hide-details></v-text-field>   
      <v-spacer></v-spacer> 

      <v-dialog v-model="dialog" fullscreen hide-overlay transition>
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
                <v-flex sm6 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.type" label="Тип машины"></v-text-field>
                </v-flex>
                <v-flex sm5 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.modification" label="Модификация"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.classification" label="Классификация типов машин"></v-text-field>
                </v-flex>                
                <v-flex xs12 sm6 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.espul_code" label="Код ЕС ПУЛ"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.cnt_type_params" label="Количество параметрова типов машин"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.cnt_mach_params" label="Количество параметров машин"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4 class="pr-1 pl-1">
                  <v-text-field readonly v-model="editedItem.cnt_mach" label="Количество машин редактируемого типа"></v-text-field>
                </v-flex>
              </v-layout>
              
              <diag-params-list :pMachTypeId="this.selectedMachTypeId" :pMachId="null"  @changedMtDiagParams="changedMtDiagParams" @changedMtDiagParamsForRemove="changedMtDiagParamsForRemove"></diag-params-list>
              
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-toolbar>
    
    <v-data-table :headers="headers" :items="machTypes" :search="search"  footer-props.items-per-page-text="Строк на странице"
        no-data-text="Данные отсутствуют" no-results-text="Ничего не найдено">
      <template v-slot:no-data>
        <v-btn color="primary" @click="getMachTypesFormSrv">Перезагрузить список</v-btn>
      </template>


    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">{{icoEdit}}</v-icon>
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

import DiagParamsList from '@/components/DiagParamsList'
//import TableParamsService from '@/services/TableParamsService'

export default {
    components: {
      DiagParamsList,
    },

    mounted() {
        this.getMachTypesFormSrv()
        this.$store.dispatch('GET_MEAS_UNITS')  
        //console.log('GET TEST FROM STORE', this.$store.getters.getTest)
    },
    

    data: () => ({
      selectedMachTypeId: -1,
      dialog: false,
      search: null,
      icoSearch: mdiMagnify,
      icoAdd: mdiPlus,
      icoDel: mdiDelete,
      icoEdit: mdiPencil,
      icoClose: mdiClose,
      icoRadioList: mdiFormatListBulleted,
      headers: [
        {text: 'ID',align: 'left',sortable: true, value: 'id'},
        { text: '', align: 'left',value: 'action', sortable: false },
        {text: 'Тип машины',align: 'left',sortable: true, value: 'type'},
        {text: 'Модификация',align: 'left',sortable: true, value: 'modification'},        
        { text: 'Классификация типов машин', align: 'left',value: 'classification' },
        { text: 'Код ЕС ПУЛ', align: 'left',value: 'espul_code' },
        { text: 'Кол. парам. типов машин', align: 'left',value: 'cnt_type_params' },
        { text: 'Кол. парам. машин', align: 'left',value: 'cnt_mach_params' },
        { text: 'Кол. машин', align: 'left',value: 'cnt_mach' },
      ],
      editedIndex: -1,
      editedItem: {
        id: null,  
        type: null,
        modification: null,
        classification: null,
        espul_code: null,
        cnt_type_params: null,
        cnt_mach_params: null,
        cnt_mach: null,
      },
      defaultItem: {
        id: null,  
        type: null,
        modification: null,
        classification: null,
        espul_code: null,
        cnt_type_params: null,
        cnt_mach_params: null,
        cnt_mach: null,
      },
      lstDelParams: [],
      lstParams: [],     
    }),



    computed: {
        formTitle () {
            return (this.editedIndex === -1 ? 'Добавление параметров для машин ' : 'Редактирование параметров для машин') + ' ' + this.editedItem.type + ' ' + this.editedItem.modification
        },
        machTypes(){
            //console.info('machTypes', this.$store.getters.getMachTypes)
            return this.$store.getters.getMachTypes
        },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      /*
      dialogDt: false,
      lstDtFields: [],
      selectedDtField = null,
      */

      changedMtDiagParams(event){
          this.lstParams = event
          //console.info('SprTypesList changedMtDiagParams',this.lstParams)
      },
      changedMtDiagParamsForRemove(event){
          this.lstDelParams = event
          //console.info('SprTypesList changedMtDiagParamsForRemove',this.lstDelParams)
      },      

      getMachTypesFormSrv(){
        //console.info('MachTypesList', 'GET_SPR_MACH_TYPES_FROM_SRV')
        this.$store.dispatch('GET_SPR_MACH_TYPES_FROM_SRV')            
      },

      editItem (item) {
        this.editedIndex = this.machTypes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.selectedMachTypeId = item.id        
//        console.info('editItem this.selectedMachTypeId=',this.selectedMachTypeId)        
        this.dialog = true
      },



      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.selectedMachTypeId = -1
        }, 300)
      },

      save () {        
        var elem = _.find(this.machTypes,{id: this.editedItem.id})
        if (elem){
          elem.cnt_type_params = this.lstParams.length
        }

        if (this.lstParams) {
          this.lstParams.forEach(param => {
            param.tip_id = this.editedItem.id
            //console.log('SAVE_DIAG_MACH_TYPE_PARAM', param)
            
            if ((param.diag_table_id)&&(param.diag_table_param_id)&&(param.tip_id)) {
              this.$store.dispatch('SAVE_DIAG_MACH_TYPE_PARAM', param)
            }            
          });
        }


        if (this.lstDelParams) {          
          this.lstDelParams.forEach(delParam => {
            console.log('DEL_DIAG_MACH_TYPE_PARAM', delParam)
            
            if (delParam.id) {
              this.$store.dispatch('DEL_DIAG_MACH_TYPE_PARAM', delParam.id)
            }
            
          });
        }



        this.close()
      }
    },

    

  }
   
</script>

<style scoped>

</style>