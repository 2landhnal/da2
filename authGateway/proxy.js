const { createProxyMiddleware } = require('http-proxy-middleware');
const { authMiddleware, openMiddleware } = require('./middlewares');

const setupProxies = (app, routes) => {
    routes.forEach((r) => {
        const authRequiredURL = '/secure';
        app.use(
            authRequiredURL + r.url,
            authMiddleware,
            createProxyMiddleware({
                ...r.proxy,
            }),
        );
        console.log(
            `Ready to forward from [${authRequiredURL}${r.url}] to "${r.proxy.target}"`,
        );

        app.use(
            r.url,
            openMiddleware,
            createProxyMiddleware({
                ...r.proxy,
            }),
        );
        console.log(`Ready to forward from [${r.url}] to "${r.proxy.target}"`); // okay here
    });
    app.get('/', (req, res) => {
        res.status(200).json('Auth gateway');
    });
};

exports.setupProxies = setupProxies;
