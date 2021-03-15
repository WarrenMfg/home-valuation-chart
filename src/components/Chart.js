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
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
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
        <canvas ref={canvasRef} id='myChart' width='400' height='400'></canvas>
      )}
    </div>
  );
}

export default Chart;
