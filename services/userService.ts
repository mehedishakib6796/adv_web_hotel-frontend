import axios from 'axios';

const API_URL = 'http://localhost:3000';


const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
  }
  return null;
};


export const getProfileApi = async (username: string) => {
  const token = getAuthToken();
  

  const response = await axios.get(`${API_URL}/customer/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const updateProfileApi = async (newName: string, newPhone: string) => {
  const token = getAuthToken();
  

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