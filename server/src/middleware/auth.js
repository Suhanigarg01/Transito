const { ApiError } = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');

// Requires a valid Bearer token; attaches the decoded payload to req.user.
function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or malformed Authorization header');
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}

// Role-Based Access Control: allow only the listed roles.
// Usage: router.post('/', authenticate, authorize('FLEET_MANAGER'), handler)
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) throw ApiError.unauthorized();
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Requires role: ${roles.join(' or ')}. You are ${req.user.role}.`
      );
    }
    next();
  };
}

module.exports = { authenticate, authorize };
