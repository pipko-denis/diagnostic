import Api from '@/services/Api'

export default {

  getMachParams(opts) {
    if (opts.machineid !=null){
      return Api().get('/machparam/machine/' + opts.machineid)
    }else{
      return Api().get('/machparam/type/' + opts.typeid)
    }    
  },

  getMachParamsAll() {
    return Api().get('/machparam/all/')    
  },

  getMachParamsByMachine(machineid){
    return Api().get('/machparam/machine/' + machineid)
  },

  getMachParamsByType(typeid){
    return Api().get('/machparam/type/'+typeid)
  },

  getMachParamsForDiag(machineid) {
    return Api().get('/machparam/diag/' + machineid)
  },

  getDatesForDiag(imei,tablesArr){
    console.log('SERVICE getDatesForDiag', imei, tablesArr)
    return Api().post('/diagramm/dates', {imei: imei, tables: tablesArr});
  },

  getDiagData(machine_id, extCode, extParam, dtBeg, dtEnd){
    return Api().get('/diagramm/data/' + machine_id + '/' + extCode + '/' + extParam + '/' + dtBeg + '/' + dtEnd)
  },

  saveParamMachine(credentials){
    return Api().post('/machparam/machine'
      ,credentials)
  },

  saveParamType(credentials) {
    return Api().post('/machparam/type'
      , credentials)
  },

  saveParam(data) {
    return Api().post('/machparam/'
      , data)
  },  

  delMachParam(id) {
    return Api().delete('/machparam/' + id)
  },


}

