import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import User from '../pages/User';
import Error from '../pages/Error';
import Schedule from '../pages/Schedule';
import { HeaderOnly } from '../layouts';
import config from '../config';
import Registration from '../pages/Registration';
import Semester from '../pages/Semester';

const routePath = {
    login: '/login',
    signUp: '/signUp',
    user: '/user',
    home: '/',
    error: '/error',
    registration: '/registration',
    schedule: '/schedule',
    semester: '/semester',
};

const publicRoutes = [
    {
        path: routePath.login,
        component: Login,
        layout: HeaderOnly,
        redirect: routePath.home,
    },
    {
        path: routePath.signUp,
        component: Signup,
        layout: HeaderOnly,
        redirect: routePath.home,
    },
    { path: routePath.error, component: Error, layout: null },
    { path: routePath.home, component: Home },
];
const privateRoutes = [
    { path: routePath.user, component: User, layout: HeaderOnly },
    { path: routePath.schedule, component: Schedule },
    { path: routePath.registration, component: Registration },
    { path: routePath.semester, component: Semester },
];

export { privateRoutes, publicRoutes };
