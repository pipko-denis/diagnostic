import TableParamsService from '@/services/TableParamsService'

export default {
  state: {
    paramsList: [],
  },

  getters: {
    getForSelectedTable: (state) => state.paramsList,
  },

  mutations: {

    SET_PARAMS_LIST(state, payload) {
      state.paramsList = payload
    },

    ADD_PARAM_TO_LIST(state, payload) {
      state.paramsList.push(payload)
    },
    
    REMOVE_PARAM_FROM_LIST(state, payload) {
      //state.paramsList.push(payload)
      const index = state.paramsList.indexOf(payload)
      state.paramsList.splice(index, 1)
    },
    UPDATE_PARAM_IN_LIST(state, payload) {
      if (payload) {
        //if (this.$store.getters.getProtocolSelectedTrainId === payload.train_Id) {
        const elem = _.find(state.paramsList, { id: payload.id })
        if (elem) {
          Object.assign(elem, payload)
        } else {
          this.dispatch('GET_PARAMS_FROM_SRV_BY_TABLE', { trainid: payload.train_id })
        }
        // }
      }
    },


  },

  actions: {
    GET_PARAMS_FROM_SRV_BY_TABLE({ commit }, payload) {
      commit('SET_PARAMS_LIST', [])
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        TableParamsService.getTableParams(payload.tableid)
          .then(result => {
            if (result.data.message.code != 0) {
              commit('SET_PROCESSING', false)
              commit('SET_ERROR', result.data.message)
            } else {
              commit('SET_PROCESSING', false)
              commit('SET_PARAMS_LIST', result.data.data)
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

    CREATE_PARAM_FOR_TABLE({ commit }, payload) {
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        TableParamsService.saveTableParam(payload)
          .then(result => {
            if (result.data.message.code != 0) {
              commit('SET_PROCESSING', false)
              commit('SET_ERROR', result.data.message)
            } else {
              commit('SET_PROCESSING', false)
              payload.id = result.data.data.id
              commit('SET_MESSAGE', result.data.message)
              commit('ADD_PARAM_TO_LIST', payload)

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

    EDIT_TABLE_PARAM({ commit }, payload) {
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        TableParamsService.saveTableParam(payload)
          .then(result => {
            if (result.data.message.code != 0) {
              commit('SET_PROCESSING', false)
              commit('SET_ERROR', result.data.message)
            } else {
              commit('SET_PROCESSING', false)
              commit('SET_MESSAGE', result.data.message)
              commit('UPDATE_PARAM_IN_LIST', payload)
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

    REMOVE_PARAM_FROM_TABLE({ commit }, payload) {
      console.log('REMOVE_PARAM_FROM_TABLE payload', payload)
      commit('SET_PROCESSING', true)
      commit('SET_ERROR_CLEAN')
      try {
        TableParamsService.delTableParam(payload)
          .then(result => {
              commit('SET_PROCESSING', false)
              commit('REMOVE_PARAM_FROM_LIST', payload)
              commit('SET_MESSAGE', result.data.message)
          })
          .catch(err => {
            commit('SET_PROCESSING', false)
            commit('SET_ERROR', err)
          }

          )
      } catch(e){
        console.log('REMOVE_PARAM_FROM_TABLE ERROR', e)
        commit('SET_PROCESSING', false)
      }
    }


  },

}    