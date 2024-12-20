import morgan from 'morgan';

const setupLogging = (app) => {
    app.use(morgan('combined'));
};

export { setupLogging };
