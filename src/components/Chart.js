/* eslint-disable no-console */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChartJS from 'chart.js';

import { formatValuation } from '../utils';

import './styles/Chart.css';

function Chart({ homeValuationData }) {
  const canvasRef = useRef(null);
  const [estimate, setEstimate] = useState('Not enough data yet.');

  // create chart and update estimate
  useEffect(() => {
    // update estimate TODO: business logic--> if estimate is negative, still show this info? Same color?
    if (homeValuationData.length >= 2) {
      const last2Months = homeValuationData.slice(-2);
      const currentMonth = last2Months[1].valuation;
      const lastMonth = last2Months[0].valuation;
      const diff = currentMonth - lastMonth;
      const percentDiff = Math.round((diff / currentMonth) * 100);
      setEstimate(`${formatValuation(diff)} (${percentDiff}%)`);
    }

    // create chart TODO: what is minimum data length needed to render chart and still look good?
    if (homeValuationData.length) {
      const ctx = canvasRef.current.getContext('2d');
      new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: homeValuationData.map(obj => obj.month),
          datasets: [
            {
              data: homeValuationData.map(obj => obj.valuationHigh),
              backgroundColor: 'rgba(63, 131, 165, 0.075)',
              fill: '+1',
              lineTension: 0,
              borderColor: 'rgba(63, 131, 165, 1)',
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0
            },
            {
              label: 'Average estimate',
              data: homeValuationData.map(obj => obj.valuation),
              fill: false,
              lineTension: 0,
              borderColor: 'rgba(63, 131, 165, 1)',
              borderWidth: 2,
              borderCapStyle: 'round',
              // point stuff
              pointRadius: 7,
              pointBackgroundColor: 'rgba(255, 255, 255, 0)',
              pointBorderColor: 'rgba(255, 255, 255, 0)',
              pointHoverRadius: 7,
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgba(63, 131, 165, 1)',
              pointHoverBorderWidth: 2
            },
            {
              label: 'Range of estimate',
              data: homeValuationData.map(obj => obj.valuationLow),
              backgroundColor: 'rgba(63, 131, 165, 0.075)',
              fill: '-1',
              borderColor: 'rgba(63, 131, 165, 1)',
              lineTension: 0,
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    }
  }, [homeValuationData]);

  return (
    <div>
      <header className='flex items-center mb-4'>
        <div className='flex justify-center items-center mr-4 rounded-full w-14 h-14 header-icon'>
          <i className='fas fa-history text-xl'></i>
        </div>
        <h1 className='text-lg font-bold'>History</h1>
      </header>
      <p className='mb-4'>
        Your home value estimate in the last 30 days:{' '}
        <span className='estimate font-bold'>{estimate}</span>
      </p>
      <div
        className='chart-container'
        style={{
          position: 'relative',
          height: '40vh',
          width: '80vw',
          maxWidth: '625px'
        }}
      >
        <canvas ref={canvasRef} id='myChart'></canvas>
      </div>
    </div>
  );
}

Chart.propTypes = {
  homeValuationData: PropTypes.array.isRequired
};

export default Chart;
