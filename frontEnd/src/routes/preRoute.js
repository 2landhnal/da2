import { publicRoutes, privateRoutes, routePath } from '.';
import { checkCredential } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './authProvider.route';

function PreRoute(route) {
    const navigate = useNavigate();
    const { auth, setAuth, payload } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            const isPublicRoute = publicRoutes.some(
                (r) => r.path === route.path,
            );

            // Nếu route là public
            if (isPublicRoute && route.redirect && auth) {
                navigate(route.redirect, { replace: true });
            }
            // Nếu route là private
            if (!isPublicRoute) {
                if (!auth) navigate(routePath.login, { replace: true });
                else if (
                    route.allowRoles &&
                    !route.allowRoles.includes(localStorage.getItem('role'))
                ) {
                    console.log('Redirect ', routePath.home);
                    navigate(routePath.home, { replace: true });
                }
                console.log('Stay ', route);
            }
        };

        checkAuth(); // Gọi hàm bất đồng bộ
    }, [auth, navigate, route, payload]);

    if (auth === null) {
        // Có thể hiển thị trạng thái loading trong lúc chờ
        return <div>Loading...</div>;
    }

    const Component = route.component;
    return <Component />;
}

export default PreRoute;
