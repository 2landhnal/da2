import User from '../pages/User';
import { Login, ChangePassword } from '../pages/Auth';
import Home from '../pages/Home';
import Error from '../pages/Error';
import { HeaderOnly } from '../layouts';
import Registration from '../pages/Registration';
import RegistrationSchedule from '../pages/RegistrationSchedule';
import Timetable from '../pages/Timetable';
import Enroll from '../pages/Enroll';
import Course from '../pages/Query/course';
import { RoleCode } from '../config/roleCode';
import UpdateInfor from '../pages/UpdateInformation';
import OpenCourses from '../pages/Query/openCourses';
import AddCourse from '../pages/Form/addCourse';
import UpdateCourse from '../pages/Form/updateCourse';
import Room from '../pages/Query/room';
import UpdateRoom from '../pages/Form/updateRoom.js';
import AddRoom from '../pages/Form/addRoom.js';
import Class from '../pages/Query/class';
import UpdateClass from '../pages/Form/updateClass.js';
import AddClass from '../pages/Form/addClass.js';
import Semester from '../pages/Query/semester.js';
import UpdateSemester from '../pages/Form/updateSemester.js';
import AddSemester from '../pages/Form/addSemester.js';
import OpenClass from '../pages/Query/openClass.js';

export const routePath = {
    login: '/login',
    changePassword: '/changePassword',
    user: '/user',
    home: '/',
    error: '/error',
    registration: '/registration',
    course: '/course',
    enroll: '/enroll',
    timeTable: '/timeTable',
    newClass: '/newClass',
    registrationSchedule: '/registrationSchedule',
    updateInformation: '/updateInformation',
    openCourses: '/course/open',
    updateCourse: '/course/update/:id',
    addCourse: '/course/add',
    room: '/room',
    addRoom: '/room/add',
    updateRoom: '/room/update/:id',
    semester: '/semester',
    addSemester: '/semester/add',
    updateSemester: '/semester/update/:id',
    class: '/class',
    addClass: '/class/add',
    updateClass: '/class/update/:id',
    openClasses: '/openClasses',
};

export const publicRoutes = [
    {
        path: routePath.login,
        component: Login,
        layout: HeaderOnly,
        redirect: routePath.user,
    },
    { path: routePath.error, component: Error, layout: null },
    { path: routePath.home, component: Home, layout: HeaderOnly },
    { path: routePath.course, component: Course },
    { path: routePath.openCourses, component: OpenCourses },
    { path: routePath.openCourses, component: OpenCourses },
];
export const privateRoutes = [
    { path: routePath.openClasses, component: OpenClass },
    { path: routePath.registration, component: Registration },
    { path: routePath.room, component: Room, allowRoles: [RoleCode.BCSVC] },
    { path: routePath.updateInformation, component: UpdateInfor },
    {
        path: routePath.semester,
        component: Semester,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.user,
        component: User,
        allowRoles: [RoleCode.STUDENT, RoleCode.TEACHER],
    },
    {
        path: routePath.addCourse,
        component: AddCourse,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.updateCourse,
        component: UpdateCourse,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.addRoom,
        component: AddRoom,
        allowRoles: [RoleCode.BCSVC],
    },
    {
        path: routePath.updateRoom,
        component: UpdateRoom,
        allowRoles: [RoleCode.BCSVC],
    },
    {
        path: routePath.class,
        component: Class,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.addClass,
        component: AddClass,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.updateClass,
        component: UpdateClass,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.semester,
        component: Semester,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.addSemester,
        component: AddSemester,
        allowRoles: [RoleCode.BDT],
    },
    {
        path: routePath.updateSemester,
        component: UpdateSemester,
        allowRoles: [RoleCode.BDT],
    },
    { path: routePath.changePassword, component: ChangePassword },
    { path: routePath.enroll, component: Enroll },
    { path: routePath.timeTable, component: Timetable },
    { path: routePath.newClass, component: AddClass },
    { path: routePath.registrationSchedule, component: RegistrationSchedule },
];
