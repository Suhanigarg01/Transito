const { Prisma } = require('@prisma/client');
const { ApiError } = require('../utils/ApiError');

function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler. Maps ApiError and common Prisma errors to clean JSON.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: unique constraint, P2025: record not found, P2003: FK violation
    if (err.code === 'P2002') {
      const target = (err.meta && err.meta.target ? err.meta.target : ['field']).join(', ');
      return res.status(409).json({ error: `A record with this ${target} already exists.` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found.' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Referenced record does not exist.' });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Invalid data sent to the database.' });
  }

  console.error('[unhandled]', err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
