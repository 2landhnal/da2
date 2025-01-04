import User from '../pages/User';
import { Login, ChangePassword } from '../pages/Auth';
import Home from '../pages/Home';
import Error from '../pages/Error';
import { HeaderOnly } from '../layouts';
import Registration from '../pages/Registration';
import Semester from '../pages/Semester';
import RegistrationSchedule from '../pages/RegistrationSchedule';
import AddClass from '../pages/AddClass';
import Timetable from '../pages/Timetable';
import Enroll from '../pages/Enroll';
import Course from '../pages/Course';

const routePath = {
    login: '/login',
    changePassword: '/changePassword',
    user: '/user',
    home: '/',
    error: '/error',
    registration: '/registration',
    semester: '/semester',
    course: '/course',
    enroll: '/enroll',
    timeTable: '/timeTable',
    newClass: '/newClass',
    registrationSchedule: '/registrationSchedule',
};

const publicRoutes = [
    {
        path: routePath.login,
        component: Login,
        layout: HeaderOnly,
        redirect: routePath.user,
    },
    { path: routePath.error, component: Error, layout: null },
    { path: routePath.home, component: Home, layout: HeaderOnly },
    { path: routePath.course, component: Course },
];
const privateRoutes = [
    { path: routePath.registration, component: Registration },
    { path: routePath.semester, component: Semester },
    { path: routePath.user, component: User },
    { path: routePath.changePassword, component: ChangePassword },
    { path: routePath.enroll, component: Enroll },
    { path: routePath.timeTable, component: Timetable },
    { path: routePath.newClass, component: AddClass },
    { path: routePath.registrationSchedule, component: RegistrationSchedule },
];

export { privateRoutes, publicRoutes, routePath };
