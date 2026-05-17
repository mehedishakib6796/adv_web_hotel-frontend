import axios from 'axios';

const API_URL = 'http://localhost:3000';

// লোকাল স্টোরেজ থেকে ডাইনামিকালি সঠিক টোকেন রিড করার ফাংশন
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
  }
  return null;
};

// কারেন্ট লগইনড ইউজারের প্রোফাইল ডাটাবেজ থেকে নিয়ে আসার এপিআই কল
export const getProfileApi = async (username: string) => {
  const token = getAuthToken();
  
  // ব্যাকএন্ডে এখন শুধু /customer/profile এ হিট করলেই হবে, কুয়েরি প্যারামিটার (?username=...) আর লাগবে না
  const response = await axios.get(`${API_URL}/customer/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

// প্রোফাইল আপডেট করার এপিআই কল
export const updateProfileApi = async (newName: string, newPhone: string) => {
  const token = getAuthToken();
  
  // ব্যাকএন্ড যেহেতু সরাসরি টোকেন থেকে কারেন্ট ইউজারনেম বের করে নিচ্ছে, 
  // তাই ফ্রন্টএন্ড বডি থেকে currentUsername পাঠানোর আর কোনো প্রয়োজন নেই।
  const response = await axios.put(
    `${API_URL}/customer/profile/update`, 
    { 
      newUsername: newName,          
      phone: newPhone 
    }, 
    { 
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  );
  
  return response.data;
};