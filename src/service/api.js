import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
    timeout: 130000
})

export default{
    analyzeAndStats(title) {
        return api.get('/review',{
            params: {title: title}
        });
    },

    history:{
        getAll(){
            return api.get('/review/history');
        }
    }
}