const { verifyToken } = require('../config/jwt');

/**
 * Verifies the JWT sent in the Authorization header (Bearer token)
 * and attaches the decoded payload to req.user.
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid or expired token.' });
  }
};

/**
 * Restricts a route to specific roles.
 * Usage: authorize('admin'), authorize('admin', 'mentor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};

/**
 * Like `protect`, but does not fail the request if no token is provided.
 * Useful for public routes that behave slightly differently for logged-in users
 * (e.g. showing enrollment/progress on a course detail page).
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = verifyToken(token);
    }
  } catch (error) {
    // Invalid/expired token on an optional route — just proceed as a guest.
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
