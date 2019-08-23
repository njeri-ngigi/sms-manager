const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');
const userController = require('./controllers/users');
const smsController = require('./controllers/sms');
const validator = require('./middlewares/validate');
const auth = require('./middlewares/authentication');

const router = express();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

router.post('/user', validator.validateUser, userController.createUser);
router.post('/login', validator.validateLogin, userController.login);
router.delete('/user', auth.isLoggedIn, userController.deleteContact);
router.get('/user', auth.isLoggedIn, userController.getUsers);

router.post('/sms', auth.isLoggedIn, validator.validateSms, smsController.sendSms);
router.get('/sms/users/', auth.isLoggedIn, smsController.getAllUserMessages);
router.get('/sms/users/sent', auth.isLoggedIn, smsController.getSentUserMessages);
router.get('/sms/users/received', auth.isLoggedIn, smsController.getReceivedUserMessages);

module.exports = router;
