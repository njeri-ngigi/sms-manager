const user = require('../models/users');

module.exports = {
  validateUser: (req, res, next) => {
    let { name = '', phoneNumber = '' } = req.body;
    const errors = [];

    name = name.trim();
    phoneNumber = phoneNumber.trim();

    res.status(400);
     
    if (!name || !phoneNumber) {
      errors.push("name and phoneNumber fields are required");
    }

    if (!(phoneNumber > 9999 && phoneNumber < 100000)) {
      errors.push("use a valid phone number with 5 digits");
    }

    if (phoneNumber in user) {
      res.status(409);
      errors.push("phone number is already registered");
    }

    if(errors.length>0) {
      res.send({ errors });
    } else {
      next();
    }
  },
  validateId: (req, res, next) => {
    const { id } = req.params;
    if (!(id > 9999 && id < 100000)) {
      res.status(400).send({ errors: ["use a valid phone number with 5 digits"]});
    } else {
      next();
    }
  }
}