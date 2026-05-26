import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('access_token');
        if (storedToken) setToken(storedToken);
    }, [])

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.clear();
    }

    const login = async (accessToken, refreshToken) => {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        setToken(accessToken);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}