import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const useAxios = (): AxiosInstance => {
    const { token } = useAuth();
    const navigate = useNavigate();

    // Request interceptor to add the auth token header to requests
    axiosInstance.interceptors.request.use(
      config => {
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  
    // Response interceptor to capture unauthenticated requests
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                // If 401, handle it by logging out
                console.log("User is not authenticated - logging out");
                useAuth().logout();
                navigate('/login')
            }
          
            // Important: Reject the promise for all other types of errors
            return Promise.reject(error);
        }
    );
      
    return axiosInstance;
};

export default useAxios;