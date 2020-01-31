import axios from 'axios'
import store from '../store'



export default () => {

    return axios.create({
        baseURL: `http://172.25.78.109:8081/`,

        headers: {
            'Authorization': store.getters.getToken,
            //'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',
            //'Access-Control-Request-Method':  '*'
        }
        /**/
        
    })

}
