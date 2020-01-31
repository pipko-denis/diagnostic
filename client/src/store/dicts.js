import DictsService from '../services/DictsService'

export default {
  state: {
    machTypesList: [],
    measUnitsList: [],
    machinesList: [],
  },
  mutations: {
    SET_MACH_TYPES_LIST(state, payload) {
      state.machTypesList = payload
    },
    SET_MEAS_UNITS(state, payload) {
      state.measUnitsList = payload
    },
    SET_MACHINES_LIST(state, payload) {
      state.machinesList = payload
    },
  },
  
  getters: {
    getMachTypes: (state) => state.machTypesList,
    getMeasUnits: (state) => state.measUnitsList,
    getMachines: (state) => state.machinesList,
  },

  actions: {

    GET_MEAS_UNITS({ commit }, payload) {
      //console.log('store', 'GET_MEAS_UNITS')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


      DictsService.getMeasUnits()
        .then(result => {
          //console.log('GET_MEAS_UNITS', result.data)
          commit('SET_MEAS_UNITS', result.data)
        }).catch(err => {
          console.log('GET_MEAS_UNITS', err)
          commit('SET_PROCESSING', false)
          commit('SET_MEAS_UNITS', [])
          commit('SET_ERROR', err)
        }
        )
    },    

    GET_SPR_MACHINES_FROM_SRV({ commit }, payload) {
      //console.log('store', 'GET_SPR_MACHINES_FROM_SRV')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')

      DictsService.getSprMachines()
        .then(result => {
          //console.log('GET_SPR_MACHINES_FROM_SRV', result.data)
          commit('SET_MACHINES_LIST', result.data)
        }).catch(err => {
          console.log('GET_SPR_MACHINES_FROM_SRV', err)
          commit('SET_PROCESSING', false)
          commit('SET_MACHINES_LIST', [])
          commit('SET_ERROR', err)
        }
        )
    },


    GET_SPR_MACH_TYPES_FROM_SRV({ commit }, payload) {
      //console.log('store', 'GET_SPR_MACH_TYPES_FROM_SRV')
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')


      DictsService.getMachineTypes()
        .then(result => {
          //console.log('GET_SPR_MACH_TYPES_FROM_SRV', result.data)
          commit('SET_MACH_TYPES_LIST', result.data)
        }).catch(err => {
          console.log('GET_SPR_MACH_TYPES_FROM_SRV', err)
          commit('SET_PROCESSING', false)
          commit('SET_MACH_TYPES_LIST', [])
          commit('SET_ERROR', err)
        }
        )
    },
  }
}