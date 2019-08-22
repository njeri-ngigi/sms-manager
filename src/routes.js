const express = require('express');
const userController = require('./controllers/users');
const validator = require('./middlewares/validate');

const router = express();

router.post('/user', validator.validateUser, userController.createUser);
router.get('/user/:id', validator.validateId, userController.getUser)
router.get('/sms', (req, res)=>res.send("hello"));

module.exports = router;
