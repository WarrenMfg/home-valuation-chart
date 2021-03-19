const faker = require('faker');

const min = 450_000; // 150_000, 450_000, 1_900_000, 2_500_000
const max = 500_000; // 200_000, 500_000, 1_950_000, 2_600_000

const valuations = new Array(12)
  .fill(null)
  .map(() => faker.random.number({ min, max }));

const valuationDiff = Math.round((max - min) / 3); // estimation

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
