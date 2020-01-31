export default {
  state: {
    processing: false,
    messageList: [],
    errorList: [],
    processing: false,
    error: null,
    message: null,    
  },
  mutations: {
    STORE_INIT(state) {
      state.processing = false
    },
    SET_PROCESSING(state, payload) {
      state.processing = payload
    },
    SET_ERROR(state, payload) {
      state.error = payload
      let lngth = state.errorList.unshift({ dt: new Date().toLocaleString(), isError: true, payload })
      if (lngth > 100) {
        state.errorList = state.errorList.splice(0, 100)
      }
      //if (payload) console.info('error message',payload)
      setTimeout(() => {
        state.error = null
      }, 3000);
    },
    SET_MESSAGE(state, payload) {
      state.message = payload
      let lngth = state.messageList.unshift({ dt: new Date().toLocaleString(), isError: false, payload })
      if (lngth > 50) {
        state.messageList = state.messageList.splice(0, 50)
      }

      setTimeout(() => {
        state.message = null
      }, 3000);
    },
    SET_ERROR_CLEAN(state) {
      //console.info('SET_ERROR_CLEAN')
      state.error = null
    }, 

  },
  actions: {
  },
  modules: {
  }
};
