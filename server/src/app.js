const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('./config');
const apiRouter = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow non-browser tools (curl/Postman, no Origin header) and any
        // configured origin.
        if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  if (config.env !== 'test') app.use(morgan('dev'));

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
