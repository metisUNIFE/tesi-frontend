import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
    timeout: 150000
})

export default{

    history:{
        getAll(){
            return api.get('/review/history');
        }
    },

    review:{
        analyzeStream(title){
            const url = `${BASE_URL}/review/analysis?title=${encodeURIComponent(title)}`;
            return new EventSource(url);
        }
    }
}