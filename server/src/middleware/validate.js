const { ApiError } = require('../utils/ApiError');

// Validates and coerces req.body against a Zod schema, replacing it with the
// parsed result. Throws a 400 with field-level details on failure.
function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors);
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
