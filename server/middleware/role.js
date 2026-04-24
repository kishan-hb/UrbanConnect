const User = require('../models/user');

const requireRole = (allowedRole) => {
  return async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;

      if (!clerkId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== allowedRole) {
        return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  requireRole
};
