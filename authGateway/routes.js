const ROUTES = [
    {
        url: '/auth',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3001',
            changeOrigin: true,
            pathRewrite: {
                [`^/auth`]: '',
            },
        },
    },
    {
        url: '/student',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3002',
            changeOrigin: true,
            pathRewrite: {
                [`^/student`]: '',
            },
        },
    },
    {
        url: '/teacher',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3003',
            changeOrigin: true,
            pathRewrite: {
                [`^/teacher`]: '',
            },
        },
    },
    {
        url: '/course',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3004',
            changeOrigin: true,
            pathRewrite: {
                [`^/course`]: '',
            },
        },
    },
    {
        url: '/semester',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3005',
            changeOrigin: true,
            pathRewrite: {
                [`^/semester`]: '',
            },
        },
    },
    {
        url: '/class',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3006',
            changeOrigin: true,
            pathRewrite: {
                [`^/class`]: '',
            },
        },
    },
    {
        url: '/enrollment',
        rateLimit: {
            windowMs: 60 * 1000,
            max: 200,
        },
        proxy: {
            target: 'http://localhost:3007',
            changeOrigin: true,
            pathRewrite: {
                [`^/enrollment`]: '',
            },
        },
    },
];

exports.ROUTES = ROUTES;
