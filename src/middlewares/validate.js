const users = require('../models/users');
const sms = require('../models/sms');

module.exports = {
  validateUser: (req, res, next) => {
    let { name = '', phoneNumber = '' } = req.body;
    const errors = [];

    name = name.trim();
    phoneNumber = phoneNumber.trim();

    res.status(400);
     
    if (!name || !phoneNumber) {
      errors.push('name and phoneNumber fields are required');
    }

    if (!(phoneNumber > 9999 && phoneNumber < 100000)) {
      errors.push('use a valid phone number with 5 digits');
    }

    if (phoneNumber in users) {
      res.status(409);
      errors.push('phone number is already registered');
    }

    if(errors.length > 0) {
      res.send({ errors });
    } else {
      next();
    }
  },
  validateId: (req, res, next) => {
    const { id } = req.params;
    if (!(id > 9999 && id < 100000)) {
      res.status(400).send({ errors: ['use a valid phone number with 5 digits']});
    } else {
      next();
    }
  },
  validateSms: (req, res, next) => {

    console.log(users);
    const errors = [];
    let { receiver = '', sender = '', message = '' } = req.body;
    receiver = receiver.trim();
    sender = sender.trim();
    message = message.trim();

    res.status(400)

    if (!receiver || !sender || !message) {
      errors.push('receiver, sender and message fields are required');
    } else if (!(receiver in users)) {
      res.status(404);
      errors.push('receiver doesn\'t exist');
    } else if(!(sender in users)) {
      res.status(404);
      errors.push('sender doesn\'t exist');
    }

    if(errors.length > 0) {
      res.send({ errors });
    } else { next(); }
  },
  validateSmsId: (req, res, next) => {
    const { id } = req.params;
    const errors = [];

    if (id < 0) {
      res.status(400);
      errors.push('use a valid id greater than or equal to 0');
    }
    if (!(id in sms)) {
      res.status(404);
      errors.push('sms not found');
    }

    if(errors.length > 0) {
      res.send({ errors });
    } else { next(); }
  }
}