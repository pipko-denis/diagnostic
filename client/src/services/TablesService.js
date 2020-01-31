import Api from '@/services/Api'

export default {
  getTables(){
    return Api().get('/tables')
  },

  saveTable(credentials){
    return Api().post('/tables'
      ,credentials)
  },

  delTable(tableId){
    return Api().delete('/tables/' + tableId)
  },


}

