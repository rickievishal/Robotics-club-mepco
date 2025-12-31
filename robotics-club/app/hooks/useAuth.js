'use client';
import { useState, useEffect, createContext, useContext } from 'react';

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const userInfo = localStorage.getItem('userData');
                const authToken = localStorage.getItem('token');
                
                if (userInfo && authToken) {
                    setUser(JSON.parse(userInfo));
                    setToken(authToken);
                    console.log('Auth: User loaded from localStorage:', userInfo);
                } else {
                    console.log('Auth: No userData or token found');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        console.log('Auth: User logged in:', userData);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        console.log('Auth: User logged out');
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!(user && token);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
