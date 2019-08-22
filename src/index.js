const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/', router);
app.all('*', (req, res) => {res.send("Route not found")});

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
