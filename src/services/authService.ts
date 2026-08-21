import axios from 'axios';

// Get the backend URL from env, default to local FastAPI dev server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async register(data: any) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    
    async login(data: any) {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    
    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    
    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    
    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },
    
    async resetPassword(data: any) {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    }
};

export default api;
