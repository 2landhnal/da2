"use strict";
import dotenv from 'dotenv';
dotenv.config();

const ROUTES = [
    {
        url: process.env.authPrefix,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 20,
        },
        proxy: {
            target: process.env.authService,
            changeOrigin: true,
            pathRewrite: {
                [`^/authService`]: '',
            },
        },
    },
    {
        url: process.env.coursePrefix,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 20,
        },
        proxy: {
            target: process.env.courseService,
            changeOrigin: true,
            pathRewrite: {
                [`^/courseService`]: '',
            },
        },
    },
    {
        url: process.env.teacherPrefix,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 20,
        },
        proxy: {
            target: process.env.teacherService,
            changeOrigin: true,
            pathRewrite: {
                [`^/teacherService`]: '',
            },
        },
    },
    {
        url: process.env.studentPrefix,
        rateLimit: {
            windowMs: 60 * 1000,
            max: 20,
        },
        proxy: {
            target: process.env.studentService,
            changeOrigin: true,
            pathRewrite: {
                [`^/studentService`]: '',
            },
        },
    },
];

export { ROUTES };
