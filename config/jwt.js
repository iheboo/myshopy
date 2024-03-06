const jwt = require('jsonwebtoken');
require("dotenv").config();
const secret = process.env.JWT_SECRET

// Middleware to verify the token in cookie 
const verifyToken = (req, res, next) => {
  // console.log(req.cookie('userToken'),'ggggggggggggg')
  // const authHeader = req.header('Authorization');

  // console.log(req.cookie('userToken'),'ggggggggggggg')

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: 'Access denied. No token provided.' });
  // }

  // const token = authHeader.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ message: 'Access denied. No token provided.' });
  // }
  const token =req.cookies.userToken
  console.log(req.cookies.userToken,'ggggggggggggg')

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    // Optionally, check if the token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ message: 'Token has expired.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }

    // Handle other verification errors
    console.error(error);
    console.log(req.cookies.userToken,'ggggggggggggg')
    return res.status(401).json({ message: 'Invalid token.' });
  }
};


// Middleware for authorization
const authorization = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role; // Check if req.user exists before accessing role

    // If requiredRole is 'admin', check if userRole is 'admin' or 'user'
    if (requiredRole === 'admin' && (!userRole || (userRole !== 'admin' && userRole !== 'user'))) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    // If requiredRole is 'user', check if userRole is 'user'
    if (requiredRole === 'user' && userRole !== 'user') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
  };
};


module.exports = {
  verifyToken,
  authorization
};
