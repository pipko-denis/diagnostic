//import AuthService from '../services/AuthService' 
export default {
    state: {
        user: {
          isAuth: true,
          token: null,
          username: null,
          id: null,
          position: null,
          user_group: 2,
        }
    },
    getters: {
      getIsAuth: (state) => {
        return state.user.isAuth
      },
      getUserName: (state) => {
        return state.user.username
      },
      getPosition: (state) => {
        return state.user.position
      },
      getUserId: (state) => {
        return state.user.id
      },
      getUserGroup: (state) => {
        return state.user.user_group
      },
      getToken: (state) => {
        return state.user.token
      },
      getHeaders: (state) => {
        return {headers: {'Authorization': state.user.token}}
      }
    },
    mutations: {
      SET_USER(state,payload){
          Object.assign(state.user,payload)
        }
    },
    actions: {
      SIGNIN({commit},payload){
        commit('SET_PROCESSING',true)    
        commit('SET_ERROR_CLEAN')
        commit('SET_USER', { token: null, isAuth: true, username: 'Пользователь', id: null, position: null }) 
        /*
        try{    
        AuthService.signin({login: payload.login,pass: payload.pass})
          .then(result => {                        
              if (result.data.message.code != 0) {
                commit('SET_ERROR',result.data.message)
                //console.log(result.data.message.text)
                commit('SET_USER',{token:null,isAuth:false,username: null,id: null, position: null})                 
              }else{                    
                
                let user = result.data.data.user
                user.isAuth = true
                user.token = result.data.data.token
                //console.info('USER', result.data.data)
                //user.user_group = result.data.data.user_group
                //console.info('USER', user)
                commit('SET_USER',user)//{token: result.data.token,isAuth: true,username: result.data.username,id: result.data.id})
                
              }
            }
          )
          .catch(err => {                          
              commit('SET_USER',{token:null,isAuth:false,username: null,id: null, position: null}) 
              commit('SET_ERROR',err)            
            }

          )
        }finally{
          commit('SET_PROCESSING',false)
        }
        */
      },

      STATE_CHANGED({commit},payload){
        if(payload){
          commit('SET_USER',{token: payload.token,isAuth: payload.isAuth,username: payload.username,id: payload.id})
        }else{
          commit('SET_USER',{token: null,isAuth:false,username: null,id: null, position: null})
        }
      }


    }
}
