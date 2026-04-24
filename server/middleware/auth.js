const { getAuth } = require('@clerk/express');

const requireAuthentication = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.auth = auth;
  next();
};

module.exports = {
  requireAuthentication
};
