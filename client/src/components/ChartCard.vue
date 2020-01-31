<template>
  <v-card dense>       
    <v-card-title>
        <v-layout wrap>
          <v-flex sm12 md6 class="pr-1 pl-1" v-if="propShowSelecors">
              <v-autocomplete v-model="machTypeId" :items="compMachTypes" label="Тип СПС" item-value="id" item-text="full_name" @change="getDiagTables()"  clearable >
                <template slot="selection" slot-scope="data">
                  {{ data.item.full_name }}
                </template> 
                <template slot="item" slot-scope="data">
                  {{ data.item.full_name }}
                </template>  
              </v-autocomplete>
          </v-flex> 

          <v-flex sm12 md6 class="pr-1 pl-1">
              <v-autocomplete v-model="machineId" :items="compMachinesByType" label="Наименование СПС" item-value="id" item-text="full_name" @change="getDiagTables()"  clearable >
                <template slot="selection" slot-scope="data">
                  {{data.item.full_name}}
                </template> 
                <template slot="item" slot-scope="data">
                  {{data.item.full_name}}
                </template>  
              </v-autocomplete>
          </v-flex> 

          <v-flex sm12 class="pr-1 pl-1">
              <v-autocomplete v-model="tableProp" :items="diagTableParams" label="Диагностический параметр" item-value="id" item-text="full_name"  clearable >
                <template slot="selection" slot-scope="data">
                  {{data.item.full_name}}
                </template> 
                <template slot="item" slot-scope="data">
                  {{data.item.full_name}}
                </template>  
              </v-autocomplete>
          </v-flex>

          <v-flex sm9 class="pr-1 pl-1">
            <v-dialog ref="dialog" v-model="modalDat" :return-value.sync="dateRange" persistent width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="compDateRangeText" label="Период" :prepend-icon="icoSearch" readonly v-on="on" ></v-text-field>
              </template>
              <v-date-picker v-model="dateRange" :events="events"  range scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalDat = false">Отмена</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(dateRange)">Применить</v-btn>
              </v-date-picker>                          
            </v-dialog>  
          </v-flex>
          <v-flex sm3 class="pr-1 pl-1">
            <v-btn color="primary" @click="getDataForChart" >Загрузить данные</v-btn>
          </v-flex>
<!--
          <v-flex sm12 class="pr-1 pl-1">
            <v-dialog ref="dialog" v-model="modalDat" :return-value.sync="dateRange" persistent width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="compDateRangeText" label="Период" :prepend-icon="icoSearch" readonly v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="dateRange" scrollable >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalDat = false">Отмена</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(dateRange)">Применить</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
-->          

        </v-layout>
    </v-card-title>

    <v-card-text>
      <v-checkbox v-model="hideZeroes" :label="`Скрывать нули`"></v-checkbox>
      <apexchart type="area" :options="chartOptions" :series="compSeries" height="500px"></apexchart> 
      <!--<div id="chart"></div>-->
      <v-card>
        <v-text-field v-model="search" :append-icon="icoSearch" label="Поиск" single-line hide-details ></v-text-field>
        <v-data-table dense :headers="headers" :search="search" :items="compDiagData" class="elevation-1">
          <template v-slot:item.cycl_dt="{ item }" >
            {{ item.cycl_dt }}
          </template>

        </v-data-table>
      </v-card>
    </v-card-text>

  </v-card>
</template>

<script>

  import MachParamsService from '../services/MachParamsService'
  import { mdiMagnify } from '@mdi/js';
/*
  var chart = new ApexCharts(
  document.querySelector("#chart"),
  this.options
);
*/

  export default {
    name: 'ChartCard',

    data() {
      return {

        machTypeId: this.propMachTypeId,
        machineId: this.propMachineId,
        tableProp: this.propTableProp,  
        selectedTablePropName : 'Данные по диагностике',
        diagTableParams: [], 
        modalDat: false,  
        dateRange: [],
        icoSearch: mdiMagnify,
        diagData: [],
        chartOptions: 'Test',
        hideZeroes: true,
        search: null,
//dt,val,cycl_dt,uin,uout
        headers: [
        { text: 'Дата', value: 'cycl_dt' },
        { text: 'Значение', value: 'val' },
        { text: 'Исх.1', value: 'uin' },
        { text: 'Исх.2', value: 'uout' },
        ],

        series: [],
        events: ['2020-01-30','2020-01-18'],

        chartOptions: {
            chart: { type: 'area', height: 350 },
            annotations: {
              yaxis: [{ y: 30, borderColor: '#999', 
                      label: {show: true, text: 'Дата', 
                              style: { color: "#fff", background: '#00E396' }
                              }
                      }],
              xaxis: [{ x: new Date('01 Jan 2019').getTime(), borderColor: '#999', yAxisIndex: 0,
                      label: { show: true, text: 'Занчение',
                              style: { color: "#fff", background: '#775DD0'}
                              }
                      }]
            },

            dataLabels: { enabled: false },
            markers: { size: 0, style: 'hollow', },
            xaxis: { type: 'datetime', tickAmount: 6, },
            tooltip: { x: { format: 'dd MMM yyyy HH:mm:ss' } },
            fill: { type: 'gradient',  gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 100] } }, 
            noData: { text: 'Данные не загружены' },          
            selection: 'one_year',
        },

        /*
        chartOptions: {
            chart: {type: 'area',height: 350,zoom: {enabled: false} },
            dataLabels: {enabled: false },
            stroke: {curve: 'straight'},            
            title: {text: 'Fundamental Analysis of Stocks', align: 'left' },
            subtitle: { text: 'Price Movements', align: 'left' },
            //labels: series.monthDataSeries1.dates, xaxis: { type: 'datetime', },
            yaxis: { opposite: true },
            legend: { horizontalAlign: 'left' }
        },
        */
      }
    },

/*
        chartOptions: {
            chart: { type: 'area', height: 350 },
            annotations: {
              yaxis: [{ y: 30, borderColor: '#999', 
                      label: {show: true, text: 'Support', 
                              style: { color: "#fff", background: '#00E396' }
                              }
                      }],
              xaxis: [{ x: new Date('14 Nov 2012').getTime(), borderColor: '#999', yAxisIndex: 0,
                      label: { show: true, text: 'Rally',
                              style: { color: "#fff", background: '#775DD0'}
                              }
                      }]
            },

            dataLabels: { enabled: false },
            markers: { size: 0, style: 'hollow', },
            xaxis: { type: 'datetime', min: new Date('01 Mar 2012').getTime(), tickAmount: 6, },
            tooltip: { x: { format: 'dd MMM yyyy' } },
            fill: { type: 'gradient',  gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 100] } }, 
          
            selection: 'one_year',
        },

        }


    },    
*/
    

    computed: {      

      compDiagData(){
        
        if ((this.diagData)&& Array.isArray(this.diagData) && (this.diagData.length > 0)) {          
          
          if (this.hideZeroes){  
              
              var result = []
              
              this.diagData.forEach(diagRec => {              
                if (diagRec.val != "0") {
                result.push(diagRec) 
                }                

              });
            console.log('compDiagData was parsed:', result )              
            return result;

          } else{
            console.log('compDiagData is diagData', this.diagData )            
            return this.diagData
          }
        }else{
          console.log('compDiagData is empty array')            
          return [];
        }  
          
        
        
      },

      compSeries(){
        if (Array.isArray(this.compDiagData) && (this.compDiagData.length > 0)) {
          
          var resultParsed = []
          if ((this.compDiagData)&&(Array.isArray(this.compDiagData))) {
            this.compDiagData.forEach(diagRec => {       
              /*
              if (this.zeroesIsNulls && (diagRec.val == "0")){
                resultParsed.push([parseInt(diagRec.dt,10),null])
              }else{
                resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
              }
              */
             try {
              resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)]) 
             } catch (error) {
               console.log('compSeries parse error', error,diagRec)
             }
              
              

              // if ((this.hideZeroes)&&(diagRec.val != "0")) {      
              //   resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
              // }else{
              //   resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
              //   //resultParsed.push([parseInt(diagRec.dt,10),(diagRec.val == "0") ? null : parseFloat(diagRec.val)])
              // }

            });
          }
          console.log('compDiagData', resultParsed)
          return [ {name: this.selectedTablePropName ,data: resultParsed}]                    
        } else {
          return [ {name: 'Данные по диагностике',data: []}]
        }

      },

/*
      compDiagData(){
        var result = []
        if ((this.diagData)&&(Array.isArray(this.diagData))) {
          this.diagData.forEach(diagRec => {                
            
            //if (diagRec.val != "0") {      
            //  result.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
            //}
            

            if ((this.hideZeroes)&&(diagRec.val != "0")) {      
              resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
            }else{
              resultParsed.push([parseInt(diagRec.dt,10),(diagRec.val == "0") ? null : parseFloat(diagRec.val)])
            }           

          });
        }
        console.log('compDiagData', result)
        return result;
      },
*/
      machTypes(){
        return this.$store.getters.getMachTypes
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

      compMachinesByType(){                
        let tmpMachines = _.filter(this.$store.getters.getMachines ,{tip: this.machTypeId}) 
        var result = []
        tmpMachines.forEach(element => { 
          if (element.shortname)
            element.full_name = "Id:"+element.id+"; заводской №:"+ element.zav_nomer +" ("+element.shortname+")" //element.id + ": " + element.type+"-"+element.modification;
          else   
            element.full_name = "Id:"+element.id+"; заводской №:"+ element.zav_nomer;
          result.push(element);
        });
        //Id:{{ data.item.id }}; заводской №:{{ data.item.zav_nomer }} ({{data.item.shortname}})
        return result;
      },

      compDateRangeText () {
        /*
        console.info('dateRange', this.dateRange)
        if (! this.dateRange ) {
          this.dateRange = []
          console.info('dateRange not empty anymore', this.dateRange)
        }
        */
        return (!this.dateRange) ? "" : this.dateRange.join(' ~ ')
      },

    },

    methods: {

      formatDate(date){
        return date.toJSON();
      },

      getDataForChart(){
/*        
        if (!this.tableProp){
          alert("Необходимо выбрать диагностический параметр!")
          return;
        }
        if (!this.machineId){
          alert("Необходимо выбрать СПС!")
          return;
        }
        if (!this.dateRange){
          alert("Необходимо выбрать тип СПС!")
          return;
        }
        var tableParam = _.find(this.diagTableParams, {id: this.tableProp})
        console.info('getDataForChart',this.tableProp, tableParam,this.machineId,this.dateRange);

        if (!tableParam){
          alert("Не удалось получить данные по параметру по идентификатору!")
          return;
        }
*/        

        this.diagData = []
        this.series = []
        
        this.$store.commit('SET_PROCESSING',true)  
        this.$store.commit('SET_ERROR_CLEAN')  
        try{                      
          //MachParamsService.getDiagData(this.machineId, tableParam.ext_code, tableParam.ext_n_param, this.dateRange[0], this.dateRange[1])
          MachParamsService.getDiagData(1750, 115, 2, '2019-01-01', '2019-12-01')
            .then(result => {      
                
                this.$store.commit('SET_PROCESSING',false)   
                this.$store.commit('SET_MESSAGE',"Параметры таблицы загружены")
                console.info('getDataForChart result',result.data) 

                this.diagData = result.data;
                /*
                if (tableParam){
                  this.selectedTablePropName = tableParam.name//new Date().toString();
                } else{
                  this.selectedTablePropName = 'Данные по диагностике'
                }
                */
/*
                var resultParsed = []
                if ((result.data)&&(Array.isArray(result.data))) {
                  result.data.forEach(diagRec => {                  
                    //resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])

                    if ((this.hideZeroes)&&(diagRec.val != "0")) {      
                      resultParsed.push([parseInt(diagRec.dt,10),parseFloat(diagRec.val)])
                    }else{
                      resultParsed.push([parseInt(diagRec.dt,10),(diagRec.val == "0") ? null : parseFloat(diagRec.val)])
                    }

                  });
                }
                console.log('compDiagData', resultParsed)

                this.series = [ {name: 'Данные по диагностике',data: resultParsed}]
*/

              }
            )
            .catch(err => {                     
                this.$store.commit('SET_PROCESSING',false)     
                this.$store.commit('SET_ERROR',err)    
                console.info('getDataForChart service error', err)                     
              }
  
            )
        }catch(err){
          this.$store.commit('SET_PROCESSING',false)
          console.info('getDataForChart component error', err)            
        }        

      },

      getMachTypesFormSrv(){
        console.info('getMachTypesFormSrv')
        this.$store.dispatch('GET_SPR_MACH_TYPES_FROM_SRV')            
      },      
      getMachinesFormSrv(){
        console.info('getMachinesFormSrv')
        this.$store.dispatch('GET_SPR_MACHINES_FROM_SRV')
      }, 
      getDiagTables(){
        console.log('props',this.machTypeId,this.machineId);
        if (this.machineId) this.getMachParamsForDiag(this.machineId);
      },

      //cloneElem(elem) { return Object.assign({},{name: elem.tbl_name})},      

      getEventsForMachine(){        
        var tables = _.uniqBy(this.diagTableParams, 'tbl_name');     
        
        //var doubleDD = (x) => x + 'DDD';

        var cloneElem = (elem) =>  Object.assign({},{name: elem.tbl_name, dt: elem.dt_field});

        var cloneArr = tables.map(cloneElem)

        console.log(tables,cloneArr);
      },

      getMachParamsForDiag(machine_id){
///////////////////////////////////////////

          console.info('getMachParamsForDiag for ' + machine_id) 
          this.diagTableParams = []

          if (!machine_id) return
          
          this.$store.commit('SET_PROCESSING',true)  
          this.$store.commit('SET_ERROR_CLEAN')  
          try{                      
            MachParamsService.getMachParamsForDiag(machine_id)
              .then(result => {      
                  
                  this.$store.commit('SET_PROCESSING',false)   
                  this.$store.commit('SET_MESSAGE',"Параметры таблицы загружены")
                  console.info('getMachParamsForDiag result',result.data) 
                  this.diagTableParams = result.data 
                  this.getEventsForMachine();
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

////////////////////////////////////////////
//        this.diagTableParams = [];
      },


    },

    components: {
      MachParamsService,
    },

    mounted() {
      if (Array.isArray(this.$store.getters.getMachTypes) && (this.$store.getters.getMachTypes == 0)) {
        this.getMachTypesFormSrv()
      }      
      if (Array.isArray(this.$store.getters.getMachines) && (this.$store.getters.getMachines == 0)) {
        this.getMachinesFormSrv();
      }
      
    },

    watch: {
      machTypeId(newValue, oldValue) {
        if (!newValue){          
          this.machineId = null;
          this.tableId = null;
        }
      },
        tableProp(newValue, oldValue) {
          if (newValue){
            this.events = [new Date().toISOString().slice(10)]
          }else{
            this.events = []
          }
          console.log('events', oldValue,newValue,this.events)
        },

    },

    props: {      
    
      propShowSelecors: {
        type: Boolean,
        requred: true, 
      },
      
      propMachTypeId: {
        type: Number,
        default: null
      },

      propMachineId: {
        type: Number,
        default: null
      }, 

      propTableProp: {
        type: Object,
        default: null
      },
    },    
    
  }
</script>

<style scoped>

</style>