const users = require('../models/users');

module.exports = {
  validateUser: (req, res, next) => {
    let { name = '', phoneNumber = '', password = '' } = req.body;
    const errors = [];

    name = name.trim();
    phoneNumber = phoneNumber.trim();
    password = password.trim();

    res.status(400);

    if (!name || !phoneNumber) {
      errors.push('name, phoneNumber, fields are required');
    }

    if (!(phoneNumber > 9999 && phoneNumber < 100000)) {
      errors.push('use a valid phone number with 5 digits');
    }

    if (password.length < 6) {
      errors.push('password should be 6 characters long or more');
    }

    if (phoneNumber in users) {
      res.status(409);
      errors.push('phone number is already registered');
    }

    if (errors.length > 0) {
      res.send({ errors });
    } else {
      next();
    }
  },

  validateLogin: (req, res, next) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(400).send({ errors: ['phoneNumber and password are required fields'] });
    } else {
      next();
    }
  },
  validateSms: (req, res, next) => {
    const errors = [];
    let { receiver = '', message = '' } = req.body;
    receiver = receiver.trim();
    message = message.trim();

    res.status(400);

    if (!receiver || !message) {
      errors.push('receiver and message fields are required');
    } else if (!(receiver in users)) {
      res.status(404);
      errors.push('receiver doesn\'t exist');
    }

    if (errors.length > 0) {
      res.send({ errors });
    } else { next(); }
  },
};
