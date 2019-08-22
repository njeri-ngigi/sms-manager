const users = require('../models/users');

module.exports = {
  createUser: (req, res) => {
    let { name, phoneNumber } = req.body;
    name = name.trim();
    phoneNumber = phoneNumber.trim();

    users[phoneNumber] = { name, sms: [] };

    res.status(201).send(`${name} added successfully`);
  },

  getUser: (req, res) => {
    const { id: userId } = req.params;
    if (!(userId in users)) {
      res.status(404).send({ errors: ["user not found"] })
    } else {
      res.status(200).send({ data: users[userId] })
    }

  }
}
