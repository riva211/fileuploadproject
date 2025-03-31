import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const authAxios = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getUserProfile = async () => {
  const response = await authAxios.get(`${API_URL}/profile`);
  return response.data;
};

export const updateUsername = async (username) => {
  const response = await authAxios.patch(`${API_URL}/username`, { username });
  return response.data;
};

export const updatePhoneNumber = async (phoneNumber) => {
  const response = await authAxios.patch(`${API_URL}/phone`, { phoneNumber });
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await authAxios.post(`${API_URL}/address`, addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await authAxios.patch(`${API_URL}/address/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await authAxios.delete(`${API_URL}/address/${addressId}`);
  return response.data;
};
