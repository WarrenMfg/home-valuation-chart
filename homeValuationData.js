const faker = require('faker');

const valuations = new Array(12)
  .fill(null)
  .map(() => faker.random.number({ min: 450000, max: 600000 }));
const valuationDiff = 40000;
const months = [
  'Jan 2020',
  'Feb 2020',
  'Mar 2020',
  'Apr 2020',
  'May 2020',
  'Jun 2020',
  'Jul 2020',
  'Aug 2020',
  'Sep 2020',
  'Oct 2020',
  'Nov 2020',
  'Dec 2020'
];

module.exports = {
  data: valuations.map((valuation, i) => ({
    month: months[i],
    valuationHigh: valuation + valuationDiff,
    valuation: valuation,
    valuationLow: valuation - valuationDiff
  }))
};
