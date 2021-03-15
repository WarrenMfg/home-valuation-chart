/* eslint-disable no-console */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

const homeValuationData = require('./homeValuationData.json');

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(express.static('public'));

app.get('/api/home-valuation-data', (req, res) => {
  res.send(homeValuationData);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
