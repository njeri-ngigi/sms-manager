const sms = require('../models/sms');

let idCounter = 0;

module.exports = {
  sendSms: (req, res) => {
    const { receiver, sender, message } = req.body;
    const dateCreated = Date.now();

    sms[idCounter] = { dateCreated, receiver, sender, message };
    idCounter++;

    res.status(201).send({ message: 'sms sent successfully'})
  },
  getSms: (req, res) => {
    const { id } = req.params;
    res.send({ data: sms[id] })
  },
  getAllUserMessages: (req, res) => {

  },
  getSentUserMessages: (req, res) => {

  },
  getReceivedUserMessages: (req, res) => {

  },
  deleteSentMessage: (req, res) => {

  },
  deleteReceivedMessage: (req, res) => {

  }

}
