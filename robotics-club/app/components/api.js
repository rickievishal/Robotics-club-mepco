import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
})

// Add auth token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Google OAuth
export const googleAuth = (code) => api.get(`/auth/google?code=${code}`)

// Email/Password Authentication
export const emailSignup = (userData) => api.post('auth/signup', userData);
export const emailLogin = (credentials) => api.post('auth/login', credentials);

// Events API
export const getAllEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const getEventsByStatus = (status) => api.get(`/events/status/${status}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Password validation utility
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const checks = {
        length: password.length >= minLength,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    const strength = Object.values(checks).filter(Boolean).length;
    let strengthText = '';
    let strengthColor = '';
    
    if (strength < 3) {
        strengthText = 'Weak';
        strengthColor = 'red';
    } else if (strength < 4) {
        strengthText = 'Fair';
        strengthColor = 'yellow';
    } else if (strength < 5) {
        strengthText = 'Good';
        strengthColor = 'blue';
    } else {
        strengthText = 'Strong';
        strengthColor = 'green';
    }
    
    return {
        checks,
        strength,
        strengthText,
        strengthColor,
        isValid: strength >= 3 // At least Fair strength required
    };
};
