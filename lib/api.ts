import axios from 'axios';

const api = axios.create({
  // এটি অটোমেটিক .env.local ফাইল থেকে আপনার ভার্সেলের লাইভ ব্যাকেন্ড ইউআরএলটি নিয়ে নেবে
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

export default api;