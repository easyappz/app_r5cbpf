require('module-alias/register');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('@src/routes/main');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/photoapp')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error: ' + err));

app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
