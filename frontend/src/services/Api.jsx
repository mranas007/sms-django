import axios from "axios";
import { ACCESS_TOKEN } from "../constants.js";


const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})

Api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    config.headers.Authorization = `Bearer ${token}`;
    return config
})

Api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        try {
            const { response } = error;
            // Check if the response status code is 401 (Unauthorized)
            if (response && response.status === 401) {
                // Clear the token and user ID from localStorage
                localStorage.clear()
                console.log("Unauthorized! Token removed.");
            }
        } catch (err) {
            console.error("Error handling response interceptor:", err.message);
        }
        // Re-throw the error for further handling
        return Promise.reject(error);
    }
)

export default Api