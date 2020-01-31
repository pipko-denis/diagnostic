import Api from '@/services/Api'

export default {
  getSprMachines(){
  return Api().get('/dicts/machines')
  },

  getMachineTypes(credentials){
    return Api().get('/dicts/machine_types'
      ,credentials)
  },

  getMachinesByType(credentials){
    return Api().get('/dicts/machines_by_type'
      ,credentials)
  },

  getMeasUnits() {
    return Api().get('/dicts/meas_units')
  },

  getLibrary() {
    return Api().get('/dicts/library'
      , credentials)
  },



}

