const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const users = require('../models/users');

dotenv.config();

module.exports = {
  isLoggedIn: (req, res, next) => {
    const { token } = req.headers;
    try {
      const isValid = jwt.verify(token, process.env.SECRET_KEY);
      if (isValid) {
        const { phoneNumber } = jwt.decode(token);
        if (phoneNumber in users) {
          next();
        } else {
          res.status(401).send({ errors: ['authentication failed'] });
        }
      }
    } catch (error) {
      res.status(403).send({ errors: ['please provide a valid token'] });
    }
  },
};
