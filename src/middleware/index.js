const jwt = require('jsonwebtoken');

exports.requireSignIn = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization required' });
  }
};
// check role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 3) {
    next();
  } else {
    return res.status(403).json({
      message: 'You are not admin',
    });
  }
};
