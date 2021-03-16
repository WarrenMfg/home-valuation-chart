/* eslint-disable no-console */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ChartJS from 'chart.js';

import { formatValuation } from '../utils';

import './styles/Chart.css';

// remove janky animation on hover
ChartJS.defaults.global.hover = {
  mode: 'nearest',
  intersect: true,
  axis: 'x',
  animationDuration: 0
};

function Chart({ homeValuationData }) {
  const canvasRef = useRef(null);
  const [estimate, setEstimate] = useState('Not enough data yet.');

  // TODO: move this to custom hook
  // create chart and update estimate
  useEffect(() => {
    // update estimate TODO: business logic--> if estimate is negative, still show this info? Same color?
    if (homeValuationData.length >= 2) {
      const last2Months = homeValuationData.slice(-2);
      const currentMonth = last2Months[1].valuation;
      const lastMonth = last2Months[0].valuation;
      const diff = currentMonth - lastMonth;
      const percentDiff = Math.round((diff / currentMonth) * 100);
      setEstimate(`${formatValuation(diff, true)} (${percentDiff}%)`);
    }

    // create chart TODO: what is minimum data length needed to render chart and still look good?
    if (homeValuationData.length) {
      const ctx = canvasRef.current.getContext('2d');
      new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: [''].concat(
            homeValuationData.map(obj => obj.month),
            ['']
          ),
          datasets: [
            // top dashed line
            {
              data: [{}].concat(
                homeValuationData.map(obj => obj.valuationHigh),
                [{}]
              ),
              backgroundColor: 'rgba(63, 131, 165, 0.075)',
              fill: '+1',
              lineTension: 0,
              borderColor: 'rgba(63, 131, 165, 1)',
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0,
              pointHitRadius: 0
            },
            // solid line
            {
              data: [{}].concat(
                homeValuationData.map(obj => obj.valuation),
                [{}]
              ),
              fill: false,
              lineTension: 0,
              borderColor: 'rgba(63, 131, 165, 1)',
              borderWidth: 2,
              borderCapStyle: 'round',
              pointRadius: 7,
              pointHitRadius: 4,
              pointBackgroundColor: 'rgba(255, 255, 255, 0)',
              pointBorderColor: 'rgba(255, 255, 255, 0)',
              pointHoverRadius: 7,
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgba(63, 131, 165, 1)',
              pointHoverBorderWidth: 2
            },
            // bottom dashed line
            {
              data: [{}].concat(
                homeValuationData.map(obj => obj.valuationLow),
                [{}]
              ),
              backgroundColor: 'rgba(63, 131, 165, 0.075)',
              fill: '-1',
              borderColor: 'rgba(63, 131, 165, 1)',
              lineTension: 0,
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0,
              pointHitRadius: 0
            }
          ]
        },
        options: {
          layout: {
            padding: {
              top: 30
              // right: 10
            }
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  // color: 'rgb(0,0,0)',
                  display: false,
                  drawBorder: false,
                  zeroLineWidth: 0
                  // zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  display: true,
                  maxTicksLimit: 4,
                  padding: 8,
                  maxRotation: 0,
                  minRotation: 0
                }
              }
            ],
            yAxes: [
              {
                position: 'right',
                gridLines: {
                  drawBorder: false,
                  drawTicks: false,
                  zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  suggestedMin: homeValuationData[0].valuation / 3,
                  maxTicksLimit: 5,
                  mirror: true,
                  labelOffset: -10,
                  callback: function (value) {
                    if (value < 99) {
                      return '$0';
                    } else if (value < 999) {
                      return '$100';
                    } else if (value < 1_000_000) {
                      return `$${value / 1000}K`;
                    } else {
                      return `$${value / 1_000_000}M`;
                    }
                  }
                }
              }
            ]
          },
          tooltips: {
            titleAlign: 'center',
            titleFontColor: 'rgb(37, 40, 42)',
            bodyAlign: 'center',
            backgroundColor: 'rgb(255, 255, 255)',
            bodyFontColor: 'rgb(37, 40, 42)',
            borderColor: 'rgb(235,235,235)',
            borderWidth: 2,
            xPadding: 14,
            yPadding: 14,
            displayColors: false,
            // disable built-in tooltip to add custom tooltip
            enabled: false,
            custom: function (tooltipModel) {
              // Tooltip Element
              let tooltipEl = document.getElementById('chartjs-tooltip');

              // Create element on first render
              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = `<div id='custom-tooltip' class='py-3 px-4 bg-white rounded-lg shadow-lg border-2 border-gray-200'>`;
                document.body.appendChild(tooltipEl);
              }

              // Hide if no tooltip
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }

              // Set caret Position
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                tooltipEl.classList.add('no-transform');
              }

              // Set Text
              if (tooltipModel.body) {
                const target =
                  homeValuationData[tooltipModel.dataPoints[0].index - 1]; // minus 1 because of dataset concatenation

                let innerHtml = `
                  <p class='font-bold text-base text-center mb-3'>${formatValuation(
                    target.valuation,
                    false
                  )}</p>
                  <div class='flex justify-center items-center mb-1'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(66, 168, 160, 0.075);'>
                      <i class='fas fa-caret-up text-lg' style='color: rgb(66, 168, 160);'></i>
                    </div>
                    <p class='text-base'>${formatValuation(
                      target.valuationHigh,
                      false
                    )}</p>
                  </div>
                  <div class='flex justify-center items-center'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(201, 42, 82, 0.075);'>
                      <i class='fas fa-caret-down text-lg' style='color: rgb(201, 42, 82);'></i>
                    </div>
                    <p class='text-base'>${formatValuation(
                      target.valuationLow,
                      false
                    )}</p>
                  </div>`;

                const customTooltip = tooltipEl.querySelector(
                  '#custom-tooltip'
                );
                customTooltip.innerHTML = innerHtml;
              }

              // `this` will be the overall tooltip
              const position = this._chart.canvas.getBoundingClientRect();

              // Display and position
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left =
                position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top =
                position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.padding =
                tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            }
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
