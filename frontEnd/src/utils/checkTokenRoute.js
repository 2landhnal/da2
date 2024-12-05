import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkCredential } from './helper';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const CheckTokenRoute = ({ route, Layout }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const authenticated = await checkCredential();
            setIsAuthenticated(authenticated);
        };

        fetchAuthStatus();
    }, []);

    if (isAuthenticated === null) {
        // Hiển thị trạng thái loading
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Chuyển hướng đến trang login
        if (route.path === config.routes.login) {
            return (
                <Layout>
                    <route.component />
                </Layout>
            );
        } else {
            console.log('Redirect to login');
            navigate('/login');
            return null;
        }
    }

    // Nếu xác thực thành công
    return (
        <Layout>
            {route.redirect ? (
                <Navigate to={route.redirect} replace />
            ) : (
                <route.component />
            )}
        </Layout>
    );
};

export default CheckTokenRoute;
