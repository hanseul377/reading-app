import axios from 'axios';

const BASE_URL = 'https://unannullable-nonnescient-teri.ngrok-free.dev'; 

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});


export default client;
