import { createContext, useContext, useState, useEffect } from 'react';
import { checkCredential } from '../utils/helper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await checkCredential();
            setAuth(isAuthenticated);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
