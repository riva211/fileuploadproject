import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

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

export const getDashboardData = async () => {
  try {
    const response = await authAxios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response || error);
    throw new Error('Failed to fetch dashboard data');
  }
};

// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/dashboard';

// // Make a direct API request without adding the Authorization header
// export const getDashboardData = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error.response || error);
//     throw new Error('Failed to fetch dashboard data');
//   }
// };
