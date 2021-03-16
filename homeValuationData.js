const faker = require('faker');

const valuations = new Array(12)
  .fill(null)
  .map(() => faker.random.number({ min: 450000, max: 600000 })); // { min: 1900000, max: 2250000 }
const valuationDiff = 40000;
const months = [
  'Jan 2021',
  'Feb 2021',
  'Mar 2021',
  'Apr 2021',
  'May 2021',
  'Jun 2021',
  'Jul 2021',
  'Aug 2021',
  'Sep 2021',
  'Oct 2021',
  'Nov 2021',
  'Dec 2021'
];

module.exports = {
  data: valuations.map((valuation, i) => ({
    month: months[i],
    valuationHigh: valuation + valuationDiff,
    valuation: valuation,
    valuationLow: valuation - valuationDiff
  }))
};
