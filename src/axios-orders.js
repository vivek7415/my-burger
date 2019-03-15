import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://vsk-burger.firebaseio.com/'
});

export default instance;
