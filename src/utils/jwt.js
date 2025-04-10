const jwt = require("jsonwebtoken");


exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'forbidden access' }); // changed 401 to 403 for expired/invalid token
    }
    req.user = decoded;
    next();
  });
};