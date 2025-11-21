import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant/TokensConstant.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const REQUEST_TIMEOUT = 10000;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Attach auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 and token refresh
        if (error.response?.status === 401) {


            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // --- FIX 1: Use 'apiClient' instead of 'this.client' ---
                const response = await apiClient.post('/account/login/refresh/', {
                    refresh: refreshToken,
                });

                if (response?.data?.access) {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);

                    // --- FIX 2: Update default headers on 'apiClient' ---
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

                    // --- FIX 3: Update the original request's header ---
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                    // --- FIX 4: Retry the original request with 'apiClient' ---
                    return apiClient(originalRequest);

                } else {
                    localStorage.clear()
                }

            } catch (refreshError) {
                // Refresh failed, log user out
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = '/login'; // Hard redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
























// import axios from "axios";
// import { ACCESS_TOKEN } from "../constant/TokensConstant.js";


// const Api = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api',
// })

// Api.interceptors.request.use((config) => {
//     const token = localStorage.getItem(ACCESS_TOKEN)
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config
// })

// Api.interceptors.response.use(
//     (response) => {
//         return response
//     },
//     (error) => {
//         try {
//             const { response } = error;
//             // Check if the response status code is 401 (Unauthorized)
//             if (response && response.status === 401) {
//                 localStorage.clear()
//             }
//         } catch (err) {
//             console.error("Error handling response interceptor:", err.message);
//         }
//         // Re-throw the error for further handling
//         return Promise.reject(error);
//     }
// )

// export default Api;