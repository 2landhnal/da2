import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { checkCredential } from '../utils/helper';
import { jwtDecode } from 'jwt-decode'; // Chú ý: kiểm tra thư viện jwtDecode nếu bạn dùng default export.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [payload, setPayload] = useState(null);
    const location = useLocation(); // Lấy thông tin URL hiện tại

    useEffect(() => {
        console.log('Auth provider check token');
        const checkAuth = async () => {
            const isAuthenticated = await checkCredential();
            setAuth(isAuthenticated);

            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                setPayload(decoded);
                localStorage.setItem('role', decoded.role);
            } else {
                setAuth(false);
            }
        };

        checkAuth();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, payload }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
