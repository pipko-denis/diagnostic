import TablesService from '../services/TablesService'

/*
function findElemInd(arr,id){
  for (let i = 0; i < arr.length; i++) {
    //console.info(state.tablesList[i]);
    if (arr[i].id == id) {
      console.info("goal", i)
      return i
    } else {
      console.info("NOT goal", i)
      return null
    }
  }
}
*/

export default {
  state: {
    tablesList: [],
  },
  mutations: {
    SET_TABLES_LIST(state, payload) {
      state.tablesList = payload
    },

    ADD_UPD_TABLE(state, payload) {
      //console.info('ADD_UPD_TABLE tablesList & payload.id', state.tablesList, payload)
      //console.info('ADD_UPD_TABLE .table IND', state.tablesList, payload.id)


      let elem = _.find(state.tablesList, { id: payload.id })
      //console.info('ADD_UPD_TRAIN ELEM',elem)      
      if (elem) {
        let ind = state.tablesList.indexOf(elem)
        //console.info('ADD_UPD_TRAIN IND',ind)      
        Object.assign(state.tablesList[ind], payload)
      } else {
        state.tablesList.push(payload)
      }  


      /*
      var ind = findElemInd(state.tablesList, payload.id);

      console.info('ADD_UPD_TABLE IND', ind)
      if (ind != null) {        
        Object.assign(state.tablesList[ind], payload)
      } else {
        state.tablesList.push(payload)
      }
      */
      /*
      state.tablesList.sort((a, b) => (a.group_name > b.group_name) ? 1 : ((b.group_name > a.group_name) ? -1 : 0));
      */
    },

    DEL_TABLE(state, payload) {
      let ind = state.tablesList.indexOf(payload)
      //console.info('DEL_TABLE ELEM',ind)
      if (ind) {
        //console.info('DEL_TABLE IND',ind)
        state.tablesList.splice(ind, 1)
      }
    },
  },
  getters: {
    getTables: (state) => state.tablesList,
  },

  actions: {
    GET_TABLES_FROM_SRV({ commit }, payload) {
//      console.log('store','GET_TABLES_FROM_SRV')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


        TablesService.getTables()
          .then(result => {
//            console.log('GET_TABLES_FROM_SRV', result.data)
            commit('SET_TABLES_LIST', result.data)
          }).catch(err => {
            console.log('GET_TABLES_FROM_SRV', err)
            commit('SET_PROCESSING', false)
            commit('SET_TABLES_LIST', [])
            commit('SET_ERROR', err)
          }

          )


    },

    DEL_TABLE({ commit }, payload) {
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        //console.info('action DEL_TABLE payload',payload)
        TablesService.delTable({ id: payload.id })
          .then(result => {
            //console.info('DEL_TABLE result', result)
            if (result.data.message.code != 0) {
              commit('SET_PROCESSING', false)
              commit('SET_ERROR', result.data.message)
            } else {
              commit('SET_PROCESSING', false)
              //console.info('DEL_TABLE', result.data.message)
              commit('DEL_TABLE', payload)
              commit('SET_MESSAGE', result.data.message)
            }
          }
          )
          .catch(err => {
            commit('SET_PROCESSING', false)
            commit('SET_ERROR', err)
          }

          )
      } catch{
        commit('SET_PROCESSING', false)
      }
    },

    SAVE_TABLE({ commit }, payload) {
      //console.info('payload before save', payload.table)        
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      //try {
        TablesService.saveTable(payload.table)
          .then(result => {
            if (! result.data) {
              commit('SET_PROCESSING', false)
              console.info('SET_ERROR', result.data)
              //commit('SET_ERROR', result.data)
            } else {
              commit('SET_PROCESSING', false)     
              //console.info('SAVE_TABLE result 1', result.data, payload)         
              payload.table.id = result.data.id
              //ind = findElemInd(state.tablesList, payload.table.id)
              //console.info('ADD_UPD_TABLE IND', payload)
              //console.info('SAVE_TABLE result 1', result.data)
              commit('ADD_UPD_TABLE', payload.table)
              //console.info('SAVE_TABLE result 2', result.data)
              //commit('SET_MESSAGE', result.data.message)
              
              if (payload.params) {                
                payload.params.forEach(param => {
                  param.diag_table_id = payload.table.id
                  console.log('SAVE_TABLE saving param',param)
                  if (param.id) {
                    this.dispatch('EDIT_TABLE_PARAM', param)
                  } else {
                    this.dispatch('CREATE_PARAM_FOR_TABLE', param)
                  }
                });
              }

            
              if (payload.delParams) {
                console.log('SAVE_TABLE saving delParams', payload.delParams)
                payload.delParams.forEach(delParam => {
                  if (delParam.id) {
                    this.dispatch('REMOVE_PARAM_FROM_TABLE', delParam.id)
                  }
                });
              }


            }
          }
          )
          .catch(err => {
            commit('SET_PROCESSING', false)
            commit('SET_ERROR', err)
          }

          )
      //} catch (e) {
      //  commit('SET_PROCESSING', false)
     //   console.error('SAVE_TABLE',e)
      //}


    }
  }
}