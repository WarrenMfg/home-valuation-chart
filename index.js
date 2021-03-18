/* eslint-disable no-console */

const express = require('express');
const morgan = require('morgan');
const homeValuationData = require('./homeValuationData');

const PORT = process.env.PORT || 5500;
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.static('public'));

// endpoints
app.get('/api/home-valuation-data', (req, res) => {
  res.send(homeValuationData);
});

// listen
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
