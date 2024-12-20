import express from 'express';

import { ROUTES } from './routes.js';

import { setupLogging } from './logging.js';
import { setupRateLimit } from './ratelimit.js';
import { setupProxies } from './proxy.js';

const app = express();
const port = 8080;

setupLogging(app);
setupRateLimit(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
    console.log(`Auth gateway listening at http://localhost:${port}`);
});

export default app;
