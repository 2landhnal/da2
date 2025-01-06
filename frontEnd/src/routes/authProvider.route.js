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
        const checkAuth = async () => {
            const isAuthenticated = await checkCredential();
            setAuth(isAuthenticated);

            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                console.log(decoded);
                setPayload(decoded);
            }
        };

        checkAuth();
    }, [location.pathname]); // Chạy lại khi URL thay đổi

    return (
        <AuthContext.Provider value={{ auth, setAuth, payload }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
