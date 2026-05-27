import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => sessionStorage.getItem('access_token'));
    const [loading, setLoading] = useState(!!sessionStorage.getItem('access_token') && !sessionStorage.getItem('user'));

    useEffect(() => {
        if (token && !user) {
            fetch('https://api.spotify.com/v1/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch profile');
                    return res.json();
                })
                .then(profile => {
                    const userData = {
                        id: profile.id,
                        displayName: profile.display_name,
                        email: profile.email,
                        profileImage: profile.images?.[0]?.url || null,
                    };
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        }
    }, [token]);

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
        <AuthContext.Provider value={{ token, user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}