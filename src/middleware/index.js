const jwt = require('jsonwebtoken');

exports.requireSignIn = (req, res, next) => {
  console.log('2222');
  if (req.headers.authorization) {
    // console.log(req.headers.authorization);
    console.log('3333');
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET); // submit token to show profile
    req.user = user;
  } else {
    return res.status(401).json({ message: 'Authorization required' });
  }
  next();
};
