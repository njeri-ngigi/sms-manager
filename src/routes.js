const express = require('express');

const router = express();

router.get('/sms', (req, res)=>res.send("hello"));

module.exports = router;
