import { createContext, useContext, useEffect, useState } from 'react';
import {api} from '../api/axios'; 

// Interface definitions
interface User {
    _id?: string;
    fullName?: string;
    email?: string;
    role?: 'client' | 'admin';
}

interface AuthContextProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    isAuthenticated: boolean;  // Changed from Boolean to boolean
    setIsAuthenticated: (value: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    user: null,
    setUser: () => {}
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    // Initialize authentication state with proper error handling
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            const token = localStorage.getItem('accessToken');
            return Boolean(token);
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return false;
        }
    });

    // Initialize user state with proper error handling
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) return null;
            
            
            return JSON.parse(savedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user'); // Clean up corrupted data
            return null;
        }
    });

     // Verify token on mount and after token refresh
    useEffect(() => {
        const verifyToken = async () => {
            try {
            const response = await api.get('/users/verify');
            const verifiedUser = response.data?.user;

            if (verifiedUser) {
                setUser(verifiedUser);
                localStorage.setItem('user', JSON.stringify(verifiedUser));
                setIsAuthenticated(true);
            } else {
                throw new Error("No user returned");
            }
            } catch (error) {
            console.error("Verification failed:", error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            }
        };

        if (isAuthenticated) {
            verifyToken();
        }
    }, [isAuthenticated]);


    return (
        <AuthContext.Provider 
            value={{
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser
            }}
        > 
            {children}
        </AuthContext.Provider>
    );
};