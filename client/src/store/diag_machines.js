import MachParamsService from '../services/MachParamsService'

export default {
  state: {
    machParameters: [],
    //machTypesList: [],
    //measUnitsList: [],
  },
  mutations: {
    SET_DIAG_MACH_PARAMS(state,payload){
      state.machParameters = payload;
    },
    
    ADD_DIAG_MACH_PARAM(state, payload) {
      let elem = _.find(state.machParameters, { id: payload.id })
      console.log("ADD_DIAG_MACH_PARAM founded elem", payload, elem)
      if (elem) {
        let ind = state.machParameters.indexOf(elem)
        Object.assign(state.machParameters[ind], payload)
      } else {
        state.machParameters.push(payload)
      } 
    },

    DEL_DIAG_MACH_PARAMETER(state, payload) {
      
      let ind = state.machParameters.indexOf(payload)
      console.log("DEL_DIAG_MACH_PARAM founded elem", payload, ind)
      if (ind) {                
        state.machParameters.splice(ind,1)
      } else {
        console.log("DEL_DIAG_MACH_PARAM elem not found ")
      }
    },    
    
/*    
    SET_MACH_TYPES_LIST(state, payload) {
      state.machTypesList = payload
    },
    SET_MEAS_UNITS(state, payload) {
      state.measUnitsList = payload
    },
*/    
  },

  getters: {
    getTest(){ return "TEST TEST TEST"},
    getDiagMachParams: (state) => state.machParameters,
  },

  actions: {

    DEL_DIAG_MACH_PARAMETER({ commit }, payload) {
      console.log('STORE DEL_DIAG_MACH_TYPE_PARAM', payload)
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


      MachParamsService.delMachParam(payload.id)
        .then(result => {
          console.log('DEL_DIAG_MACH_PARAMETER', result.data)
          commit('DEL_DIAG_MACH_PARAMETER', payload)
        }).catch(err => {
          console.log('DEL_DIAG_MACH_TYPE_PARAM', err)
          commit('SET_PROCESSING', false)
          commit('SET_ERROR', err)
        }
        )
    },

    SAVE_DIAG_MACH_TYPE_PARAM({ commit }, payload) {
      console.log('STORE', 'SAVE_DIAG_MACH_TYPE_PARAM')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


      MachParamsService.saveParam(payload)
        .then(result => {          
          payload.id = result.data.id
          console.log('SAVE_DIAG_MACH_TYPE_PARAM payload = ', payload)
          commit('ADD_DIAG_MACH_PARAM', payload)
        }).catch(err => {
          console.log('SAVE_DIAG_MACH_TYPE_PARAM', err)
          commit('SET_PROCESSING', false)
          commit('SET_ERROR', err)
        }
        )
    },    

    GET_DIAG_MACH_PARAMETERS({ commit }, payload) {
      commit('SET_DIAG_MACH_PARAMS', [])

      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        MachParamsService.getMachParamsAll()
          .then(result => {
            //console.log('getParamsList', result.data)
            commit('SET_PROCESSING', false)
            commit('SET_MESSAGE', "Параметры для типа машины загружены")
            console.log('GET_DIAG_MACH_PARAMETERS data', result.data)
            if ((result.data) && (result.data.length > 0)) {
              commit('SET_DIAG_MACH_PARAMS', result.data)
              //this.state.machParameters = result.data
            } else {
              //console.log('Параметры для типа машины с ID = ' + this.pMachTypeId + ' не найдены. ')
              commit('SET_DIAG_MACH_PARAMS', [])
            }
            console.log('GET_DIAG_MACH_PARAMETERS state ', this.state.machParameters)
          }
          )
          .catch(err => {
            commit('SET_PROCESSING', false)
            commit('SET_ERROR', err)
            console.info('diag_machines getMachParamsAll', err)
          }

          )
      } catch (err) {
        commit('SET_PROCESSING', false)
        console.info('machParams4', err)
      }
    },

    SAVE_DIAG_MACH_PARAM({ commit }, payload) {
      console.log('STORE', 'SAVE_DIAG_MACH_PARAM')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


      MachParamsService.saveParam(payload)
        .then(result => {
          console.log('SAVE_DIAG_MACH_PARAM', result.data)
                   
        }).catch(err => {
          console.log('SAVE_DIAG_MACH_PARAM', err)
          commit('SET_PROCESSING', false)
          commit('SET_ERROR', err)
        }
        )
    },      
    
  }
}  