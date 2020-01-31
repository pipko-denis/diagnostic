import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './user'
import GeneralModule from './general'
import Tables from './tables'
import TableParams from './table_params'
import Dicts from './dicts'
import DiagMachines from './diag_machines'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  modules: {
    UserModule,
    GeneralModule,
    Tables,
    TableParams,
    Dicts,
    DiagMachines,
  }
})
