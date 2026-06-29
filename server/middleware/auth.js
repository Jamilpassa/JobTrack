const jwt = require('jsonwebtoken');

/**
 * Middleware that checks for a valid JWT in the httpOnly cookie.
 * Attach this to any route that requires the user to be logged in.
 */
module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated — please log in' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email } — available in all protected routes
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired — please log in again' });
  }
};
