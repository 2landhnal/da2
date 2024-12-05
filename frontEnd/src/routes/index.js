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

const publicRoutes = [
    {
        path: config.routes.login,
        component: Login,
        layout: HeaderOnly,
        redirect: config.routes.home,
    },
    {
        path: config.routes.signUp,
        component: Signup,
        layout: HeaderOnly,
        redirect: config.routes.home,
    },
    { path: config.routes.error, component: Error, layout: null },
    { path: config.routes.home, component: Home },
];
const privateRoutes = [
    { path: config.routes.user, component: User, layout: HeaderOnly },
    { path: config.routes.schedule, component: Schedule },
    { path: config.routes.registration, component: Registration },
    { path: config.routes.semester, component: Semester },
];

export { privateRoutes, publicRoutes };
