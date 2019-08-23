const jwt = require('jsonwebtoken');
const sms = require('../models/sms');
const users = require('../models/users');


let idCounter = 0;

module.exports = {
  sendSms: (req, res) => {
    const { phoneNumber: sender } = jwt.decode(req.headers.token);
    const { receiver, message } = req.body;
    const dateCreated = Date.now();

    if (sender === receiver) {
      return res.status(400).send({ message: 'You cannot send yourself a message' });
    }

    sms[idCounter] = {
      dateCreated, receiver, sender, message,
    };
    users[sender].smsSent.push(idCounter);
    users[receiver].smsReceived.push(idCounter);

    // eslint-disable-next-line no-plusplus
    idCounter++;

    return res.status(201).send({ message: 'sms sent successfully' });
  },

  getAllUserMessages: (req, res) => {
    const { phoneNumber } = jwt.decode(req.headers.token);
    const { smsSent, smsReceived } = users[phoneNumber];
    const sent = [];
    const received = [];

    smsSent.map((message) => sent.push(sms[message]));
    smsReceived.map((message) => received.push(sms[message]));

    res.status(200).send({ data: { sent, received } });
  },

  getSentUserMessages: (req, res) => {
    const { phoneNumber } = jwt.decode(req.headers.token);
    const { smsSent } = users[phoneNumber];
    res.status(200).send({
      data: [
        smsSent.map((message) => sms[message]),
      ],
    });
  },

  getReceivedUserMessages: (req, res) => {
    const { phoneNumber } = jwt.decode(req.headers.token);
    const { smsReceived } = users[phoneNumber];
    res.status(200).send({
      data: [
        smsReceived.map((message) => sms[message]),
      ],
    });
  },
};
