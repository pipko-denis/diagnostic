import Api from '@/services/Api'

export default {
    signin (credentials){
        //console.info('TOKEN FROM SIGNIN',mainToken)   
        return Api().post('signin',credentials)
    }
}

