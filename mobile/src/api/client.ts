import axios from 'axios';

const BASE_URL = 'https://annalise-unreverberative-tipsily.ngrok-free.dev'; 

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});


export default client;
