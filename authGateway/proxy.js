import { createProxyMiddleware } from 'http-proxy-middleware';
import {
    authMiddleware,
    teacherMiddleware,
    adminMiddleware,
    openMiddleware,
} from './middlewares.js';

const setupProxies = (app, routes) => {
    routes.forEach((r) => {
        // internal route
        app.use(r.url + '/internal', (req, res, next) => {
            console.log(
                `Blocked access to ${req.url} because it contains '/internal'`,
            );
            res.status(403).send('Access to /internal is blocked');
        });

        const adminRequiredProxy = Object.create(r.proxy);
        const adminRequiredURL = '/adminRequired';
        adminRequiredProxy.target += adminRequiredURL;
        app.use(
            r.url + adminRequiredURL,
            adminMiddleware,
            createProxyMiddleware({
                ...adminRequiredProxy,
                on: {
                    proxyReq: (proxyReq, req, res) => {
                        /* handle proxyReq */
                        if (req.tokenData) {
                            proxyReq.setHeader(
                                'x-token-data',
                                JSON.stringify(req.tokenData),
                            );
                        }
                    },
                    proxyRes: (proxyRes, req, res) => {
                        /* handle proxyRes */
                    },
                    error: (err, req, res) => {
                        /* handle error */
                    },
                },
            }),
        );
        console.log(
            `Ready to forward [${r.url}${adminRequiredURL}] to "${adminRequiredProxy.target}"`,
        );

        const teacherRequiredProxy = Object.create(r.proxy);
        const teacherRequiredURL = '/teacherRequired';
        teacherRequiredProxy.target += teacherRequiredURL;
        app.use(
            r.url + teacherRequiredURL,
            teacherMiddleware,
            createProxyMiddleware({
                ...teacherRequiredProxy,
                on: {
                    proxyReq: (proxyReq, req, res) => {
                        /* handle proxyReq */
                        if (req.tokenData) {
                            proxyReq.setHeader(
                                'x-token-data',
                                JSON.stringify(req.tokenData),
                            );
                        }
                    },
                    proxyRes: (proxyRes, req, res) => {
                        /* handle proxyRes */
                    },
                    error: (err, req, res) => {
                        /* handle error */
                    },
                },
            }),
        );
        console.log(
            `Ready to forward [${r.url}${teacherRequiredURL}] to "${teacherRequiredProxy.target}"`,
        );

        const authRequiredProxy = Object.create(r.proxy);
        const authRequiredURL = '/authRequired';
        authRequiredProxy.target += authRequiredURL;
        app.use(
            r.url + authRequiredURL,
            authMiddleware,
            createProxyMiddleware({
                ...authRequiredProxy,
                on: {
                    proxyReq: (proxyReq, req, res) => {
                        /* handle proxyReq */
                        if (req.tokenData) {
                            proxyReq.setHeader(
                                'x-token-data',
                                JSON.stringify(req.tokenData),
                            );
                        }
                    },
                    proxyRes: (proxyRes, req, res) => {
                        /* handle proxyRes */
                    },
                    error: (err, req, res) => {
                        /* handle error */
                    },
                },
            }),
        );
        console.log(
            `Ready to forward [${r.url}${authRequiredURL}] to "${authRequiredProxy.target}"`,
        );
        app.use(
            r.url,
            openMiddleware,
            createProxyMiddleware({
                ...r.proxy,
                onProxyReq: (proxyReq, req) => {
                    if (req.tokenData) {
                        proxyReq.setHeader(
                            'x-token-data',
                            JSON.stringify(req.tokenData),
                        );
                    }
                },
            }),
        );
        console.log(`Ready to forward [${r.url}] to "${r.proxy.target}"`);
    });
    app.get('/', (req, res) => {
        res.status(200).json('Auth gateway');
    });
};

export { setupProxies };
