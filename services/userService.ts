import axios from 'axios';

export const updateProfileApi = async (newName: string, newPhone: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const currentUsername = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
  
  const response = await axios.put(
    'http://localhost:3000/customer/profile/update', 
    { 
      currentUsername: currentUsername, // ডাটাবেসে ইউজারকে খুঁজে বের করার জন্য
      newUsername: newName,          // নতুন ইউজারনেম
      phone: newPhone 
    }, 
    { 
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
  
  return response.data;
};