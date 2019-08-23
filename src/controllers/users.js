const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const users = require('../models/users');
const sms = require('../models/sms');

dotenv.config();

module.exports = {
  createUser: (req, res) => {
    const { password } = req.body;
    let { name, phoneNumber } = req.body;
    name = name.trim();
    phoneNumber = phoneNumber.trim();
    const hash = bcrypt.hashSync(password, 10);
    users[phoneNumber] = {
      name, password: hash, smsSent: [], smsReceived: [],
    };

    const token = jwt.sign({ phoneNumber }, process.env.SECRET_KEY);
    res.status(201).send({ token, message: `${name} added successfully` });
  },
  login: (req, res) => {
    const { phoneNumber, password } = req.body;
    const user = users[phoneNumber];

    if (user) {
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const token = jwt.sign({ phoneNumber }, process.env.SECRET_KEY);
        return res.status(200).send({ token });
      }
    }

    return res.status(401).send({ error: ['phonenumber or password incorrect'] });
  },

  getUsers: (req, res) => {
    res.send({ data: Object.keys(users) });
  },

  deleteContact: (req, res) => {
    const { token } = req.headers;
    const { phoneNumber } = jwt.decode(token);
    if (phoneNumber in users) {
      const { smsSent } = users[phoneNumber];
      smsSent.map((message) => delete sms[message]);
      delete users[phoneNumber];
      res.status(200).send({ message: 'contact deleted successfully' });
    } else {
      res.status(404).send({ errors: ['user not found'] });
    }
  },
};
