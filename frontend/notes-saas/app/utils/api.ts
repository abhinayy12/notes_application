import axios from 'axios';

const api = axios.create({
  baseURL: 'https://notes-application-flame-nu.vercel.app',
});

export default api;