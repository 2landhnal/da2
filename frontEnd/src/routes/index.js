import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import User from '../pages/User';
import Error from '../pages/Error';
import Schedule from '../pages/Schedule';
import { HeaderOnly } from '../layouts';
import Registration from '../pages/Registration';
import Semester from '../pages/Semester';
import Landing from '../pages/Landing';

const routePath = {
    login: '/login',
    signUp: '/signUp',
    user: '/user',
    home: '/home',
    error: '/error',
    registration: '/registration',
    schedule: '/schedule',
    semester: '/semester',
    landing: '/',
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
    { path: routePath.landing, component: Landing },
];
const privateRoutes = [
    { path: routePath.user, component: User, layout: HeaderOnly },
    { path: routePath.schedule, component: Schedule },
    { path: routePath.registration, component: Registration },
    { path: routePath.semester, component: Semester },
    { path: routePath.home, component: Home },
];

export { privateRoutes, publicRoutes, routePath };
