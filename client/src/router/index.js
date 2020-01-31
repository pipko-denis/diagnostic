import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Logout from '../views/Logout.vue'
import SprMachines from '../views/SprMachines.vue'
import SprTypes from '../views/SprTypes.vue'
import DiagTables from '../views/DiagTables.vue'
import DiagMachines from '../views/DiagMachines.vue'
import DiagDims from '../views/DiagDims.vue'
/*
diag_machines
diag_dims
*/

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/spr_machines',
    name: 'spr_machines',
    component: SprMachines
  },  
  {
    path: '/spr_types',
    name: 'spr_types',
    component: SprTypes
  }, 
  {
    path: '/diag_tables',
    name: 'diag_tables',
    component: DiagTables
  },
  {
    path: '/diag_machines',
    name: 'diag_machines',
    component: DiagMachines
  },
  {
    path: '/diag_dims',
    name: 'diag_dims',
    component: DiagDims
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },  
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
