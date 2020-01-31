import Api from '@/services/Api'

export default {

  getTableParams(paramid) {
    return Api().get('/params/by_table/' + paramid)
  },

  getTableFields(name,isdt){
    return Api().get('/params/by_table_name/' + name + '/' + isdt)
  },

  saveTableParam(param){
    return Api().post('/params/by_table/' + param.diag_table_id
      , param)
  },

  getTableParamById(paramid){
    return Api().get('/params/by_id/' + paramid)
  },

  delTableParam(paramid) {
    return Api().delete('/params/' + paramid)
  },




}

