import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    // other fields...
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: User, rememberMe?: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to authenticate token', error);
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User, rememberMe: boolean = true) => {
        if (rememberMe) {
            localStorage.setItem('token', token);
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('token', token);
            localStorage.removeItem('token');
        }
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error('Logout error', e);
        }
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
