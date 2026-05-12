import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // তোমার ব্যাকএন্ড যদি ৩০০০ এ চলে
});

export default api;