import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiManager, apiAuth } from '../api/auth';

export interface UserProfile {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneExtension: string;
    role: string;
}

// export interface UserAccount{
//     email: string;
//     userName: string;
//     password: string;
//     confirmPassword: string;
// }

interface AuthContextType {
    token: string | null;
    user: UserProfile | null;
    // account: UserAccount | null;
    isAuthenticated: boolean;
    isLoadingUser: boolean;
    login: (token: string, rememberMe: boolean) => void;
    logout: () => void;
    refreshUserProfile: () => Promise<void>;
    // register:(userAccount: UserAccount) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    // const [account, setAccount] = useState<UserAccount | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    const fetchUserProfile = async (currentToken: string) => {
        try{
            apiManager.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
            const response = await apiManager.get('/Users/GetMyUser');

            if(response.data){
                setUser(response.data.data);
            }
            else{
                console.error("No se pudo cargar el perfil de usuario. Respuesta:", response);
            }
        } catch (error) {
            console.error("Error al cargar el perfil de usuario:", error);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
        if (savedToken) {
            setToken(savedToken);
            fetchUserProfile(savedToken);
        }
        else {
            setIsLoadingUser(false);
        }
    }, []);

    const login = (newToken: string, rememberMe: boolean) => {
        setToken(newToken);
        if (rememberMe) {
            localStorage.setItem('session_token', newToken);
        } else {
            sessionStorage.setItem('session_token', newToken);
        }
        setIsLoadingUser(true);
        fetchUserProfile(newToken);
    };

    const logout = async () => {
        try{
            if(token){
                apiAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await apiAuth.delete('/Auth/logout');
            }

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {

            localStorage.removeItem('session_token'); 
            sessionStorage.removeItem('session_token');
            delete apiAuth.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
        }
    };

    // const register = async (userAccount: UserAccount) => {
    //     try{
    //         setAccount(userAccount)

    //     } catch (error) {
    //         console.error('Error al crear cuenta:', error);
    //     }
    // };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ 
            token,
            user,
            // account,
            isAuthenticated,
            isLoadingUser, 
            login,
            logout,
            refreshUserProfile: () => fetchUserProfile(token || ''),
            // register,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};