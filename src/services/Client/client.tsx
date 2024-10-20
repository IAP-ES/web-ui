import config from '@/config';
import axios from 'axios';
import { useUserStore } from "@/stores/useUserStore";

export const createClient = (baseUrl: string) => {
    const client = axios.create({
        baseURL: baseUrl,
        timeout: 5000,
    });

    client.interceptors.request.use(
        config => {
            const token = useUserStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );

    client.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 401) {
                    console.log('Token expirado ou inválido, fazendo logout...');
                    useUserStore.getState().logout();
                    window.location.href = import.meta.env.VITE_LOGIN_SIGN_UP; // Substituir pelo domínio do Cognito
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request', error.message);
            }
            return Promise.reject(error);
        },
    );

    return client;
};