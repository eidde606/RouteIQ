import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse} from "axios";
import useAuthStore from "../store/authStore.ts";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().toke;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;