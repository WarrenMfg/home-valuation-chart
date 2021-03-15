/* eslint-disable no-console */

import React, { useRef, useEffect, useState } from 'react';
import { handleErrors } from '../utils';

import ChartJS from 'chart.js';
import Loader from './Loader';

function Chart() {
  const canvasRef = useRef(null);
  const [homeValuationData, setHomeValuationData] = useState([]);

  useEffect(() => {
    const fetchHomeValuationData = async () => {
      try {
        const response = await fetch('/api/home-valuation-data');
        const { data } = await handleErrors(response);
        setHomeValuationData(data);
      } catch (error) {
        console.error(error);
      }
    };
    setTimeout(fetchHomeValuationData, 1000);
  }, []);

  useEffect(() => {
    if (homeValuationData.length) {
      const ctx = canvasRef.current.getContext('2d');
      new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: homeValuationData.map(obj => obj.month),
          datasets: [
            {
              data: homeValuationData.map(obj => obj.valuationHigh),
              backgroundColor: ['rgba(63, 131, 165, 0.075)'],
              fill: '+1',
              borderColor: ['rgba(63, 131, 165, 1)'],
              borderWidth: 1,
              lineTension: 0,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0
            },
            {
              label: 'Average estimate',
              data: homeValuationData.map(obj => obj.valuation),
              borderColor: ['rgba(63, 131, 165, 1)'],
              fill: false,
              borderWidth: 2,
              lineTension: 0,
              // pointHoverRadius: 0,
              pointRadius: 2
            },
            {
              label: 'Range of estimate',
              data: homeValuationData.map(obj => obj.valuationLow),
              backgroundColor: ['rgba(63, 131, 165, 0.075)'],
              fill: '-1',
              borderColor: ['rgba(63, 131, 165, 1)'],
              borderWidth: 1,
              lineTension: 0,
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
    <div className='my-4'>
      {homeValuationData.length === 0 ? (
        <Loader />
      ) : (
        <canvas ref={canvasRef} id='myChart' width='675' height='315'></canvas>
      )}
    </div>
  );
}

export default Chart;
