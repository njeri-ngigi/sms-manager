const express = require('express');
const userController = require('./controllers/users');
const smsController = require('./controllers/sms');
const validator = require('./middlewares/validate');

const router = express();

router.post('/user', validator.validateUser, userController.createUser);
router.delete('/user', userController.deleteContact);
router.get('/user/:id', validator.validateId, userController.getUser);

router.post('/sms', validator.validateSms, smsController.sendSms);
router.get('/sms/:id', validator.validateSmsId, smsController.getSms);
router.get('/sms/users/:id/all', validator.validateId, smsController.getAllUserMessages);
router.get('/sms/users/:id/sent', validator.validateId, smsController.getSentUserMessages);
router.get('/sms/users/:id/received', validator.validateId, smsController.getReceivedUserMessages);
router.delete('/sms/users/:id/sent', validator.validateId, smsController.deleteSentMessage);
router.delete('/sms/users/:id/received', validator.validateId, smsController.deleteReceivedMessage);

module.exports = router;
