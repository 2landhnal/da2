import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { checkCredential, getAccessTokenExpiredTime } from '../utils/helper';
import { jwtDecode } from 'jwt-decode'; // Chú ý: kiểm tra thư viện jwtDecode nếu bạn dùng default export.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [payload, setPayload] = useState(null);
    const location = useLocation(); // Lấy thông tin URL hiện tại
    const checkAuth = async () => {
        console.log('Auth provider check token');
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

        console.log('CHECK DONE');
    };

    useEffect(() => {
        let isMounted = true;

        const runCheckAuth = async () => {
            let time = getAccessTokenExpiredTime();
            time = time > 0 ? time : 10000;

            console.log({ time });

            // Wait for checkAuth to complete
            await checkAuth();

            // Schedule the next run if the component is still mounted
            if (isMounted) {
                setTimeout(runCheckAuth, time);
            }
        };

        // Start the loop
        runCheckAuth();

        return () => {
            isMounted = false; // Cleanup to avoid scheduling when unmounted
        };
    }, [location.pathname]);

    // useEffect(() => {
    //     checkAuth();
    // }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, payload }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
