const express = require('express');

const { ROUTES } = require('./routes');
const cors = require('cors');
const { setupLogging } = require('./logging');
const { setupRateLimit } = require('./ratelimit');
const { setupProxies } = require('./proxy');

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
const port = process.env.port || 8080;

setupLogging(app);
setupRateLimit(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
    console.log(`Auth gateway listening at http://localhost:${port}`);
});
