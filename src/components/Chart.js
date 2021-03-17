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
  const chartRef = useRef(null);
  const [estimate, setEstimate] = useState('Not enough data yet.');
  const [selectedHomeValuationData, setSelectedHomeValuationData] = useState([
    ...homeValuationData
  ]);

  // create chart and update estimate
  useEffect(() => {
    // update estimate
    // TODO: if estimate is negative, still show this info? If so, same color?
    if (homeValuationData.length >= 2) {
      const last2Months = homeValuationData.slice(-2);
      const currentMonth = last2Months[1].valuation;
      const lastMonth = last2Months[0].valuation;
      const diff = currentMonth - lastMonth;
      const percentDiff = Math.round((diff / currentMonth) * 100);
      setEstimate(
        `${formatValuation({
          data: diff,
          withSign: true,
          roundToNearestThousand: false
        })} (${percentDiff}%)`
      );
    }

    // create chart TODO: what is minimum data length needed to render chart and still look good?
    if (selectedHomeValuationData.length) {
      const ctx = canvasRef.current.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels:
            selectedHomeValuationData.length >= 6
              ? selectedHomeValuationData.map(obj => obj.month).concat(['']) // need extra space
              : selectedHomeValuationData.map(obj => obj.month),
          datasets: [
            // top dashed line
            {
              data: selectedHomeValuationData.map(obj => obj.valuationHigh),
              backgroundColor: 'rgb(243, 249, 251)',
              fill: '+1',
              lineTension: 0,
              borderColor: 'rgb(0, 133, 167)',
              borderWidth: 1,
              borderDash: [1, 3],
              pointHoverRadius: 0,
              pointRadius: 0,
              pointHitRadius: 0
            },
            // solid line
            {
              data: selectedHomeValuationData.map(obj => obj.valuation),
              fill: false,
              lineTension: 0,
              borderColor: 'rgb(0, 133, 167)',
              borderWidth: 2,
              borderCapStyle: 'round',
              pointRadius: 7,
              pointHitRadius: 4,
              pointBackgroundColor: 'rgba(255, 255, 255, 0)',
              pointBorderColor: 'rgba(255, 255, 255, 0)',
              pointHoverRadius: 7,
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgb(0, 133, 167)',
              pointHoverBorderWidth: 2
            },
            // bottom dashed line
            {
              data: selectedHomeValuationData.map(obj => obj.valuationLow),
              backgroundColor: 'rgb(243, 249, 251)',
              fill: '-1',
              borderColor: 'rgb(0, 133, 167)',
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
          legend: {
            display: false
          },
          layout: {
            padding: {
              top: 20
            }
          },
          scales: {
            xAxes: [
              {
                offset: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                  zeroLineWidth: 0
                },
                ticks: {
                  maxTicksLimit: 4,
                  maxRotation: 0,
                  minRotation: 0,
                  fontSize: 16,
                  padding: 8,
                  fontColor: 'rgb(37, 40, 42)',
                  fontFamily:
                    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
                }
              }
            ],
            yAxes: [
              {
                position: 'right',
                gridLines: {
                  lineWidth: 2,
                  color: 'rgb(235,235,235)',
                  drawBorder: false,
                  drawTicks: false,
                  zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  suggestedMin: selectedHomeValuationData[0].valuation / 3,
                  maxTicksLimit: 5,
                  mirror: true,
                  labelOffset: -10,
                  fontSize: 16,
                  fontColor: 'rgb(37, 40, 42)',
                  fontFamily:
                    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
                  callback: function (value) {
                    if (value < 100) {
                      return '$0';
                    } else if (value < 1000) {
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
                  selectedHomeValuationData[tooltipModel.dataPoints[0].index];

                let innerHtml = `
                  <p class='font-bold text-base text-center mb-3'>${formatValuation(
                    {
                      data: target.valuation,
                      withSign: false,
                      roundToNearestThousand: true
                    }
                  )}</p>
                  <div class='flex justify-center items-center mb-1'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(66, 168, 160, 0.075);'>
                      <i class='fas fa-caret-up text-lg' style='color: rgb(66, 168, 160);'></i>
                    </div>
                    <p class='text-base'>${formatValuation({
                      data: target.valuationHigh,
                      withSign: false,
                      roundToNearestThousand: true
                    })}</p>
                  </div>
                  <div class='flex justify-center items-center'>
                    <div class='flex justify-center items-center w-5 h-5 mr-2 rounded-full' style='background-color: rgba(201, 42, 82, 0.075);'>
                      <i class='fas fa-caret-down text-lg' style='color: rgb(201, 42, 82);'></i>
                    </div>
                    <p class='text-base'>${formatValuation({
                      data: target.valuationLow,
                      withSign: false,
                      roundToNearestThousand: true
                    })}</p>
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
      };

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = new ChartJS(ctx, config);
      } else {
        chartRef.current = new ChartJS(ctx, config);
      }
    }
  }, [selectedHomeValuationData]);

  /**
   * Range buttons click event handler
   *
   * @param event Synthetic event object
   */
  const handleRangeButtonClick = ({ target }) => {
    if (target.classList.contains('range-button__active')) return;

    [...target.parentElement.children].forEach(child =>
      child.classList.remove('range-button__active')
    );
    target.classList.add('range-button__active');

    let range = parseInt(target.dataset.range, 10);
    let selectedHomeValuationData;

    // hard coded here and in markup
    if (range === 12) {
      selectedHomeValuationData = homeValuationData;
    } else if (range === 6) {
      selectedHomeValuationData = homeValuationData.slice(-6);
    }

    setSelectedHomeValuationData(selectedHomeValuationData);
    target.blur();
  };

  return (
    <section>
      <header className='flex items-center mb-4'>
        <div className='flex justify-center items-center mr-4 rounded-full w-14 h-14 header-icon'>
          <i className='fas fa-history text-xl'></i>
        </div>
        <h1 className='text-lg font-bold'>History</h1>
      </header>
      <p className='mb-5'>
        Your home value estimate in the last 30 days:{' '}
        <span className='estimate font-bold'>{estimate}</span>
      </p>

      {/* legend and buttons */}
      <div className='flex justify-between mb-8'>
        {/* legend */}
        <div className='flex'>
          {/* average estimate */}
          <div className='flex items-center mr-8'>
            <div
              className='w-8 h-0.5 mr-4'
              style={{ backgroundColor: 'rgb(0, 133, 167)' }}
            ></div>
            <p>Average estimate</p>
          </div>

          {/* range of estimate */}
          <div className='flex items-center'>
            <div
              className='w-8 h-1/3 mr-4'
              style={{
                backgroundColor: 'rgb(243, 249, 251)',
                borderTop: '1px dotted rgb(0, 133, 167)',
                borderBottom: '1px dotted rgb(0, 133, 167)'
              }}
            ></div>
            <p>Range of estimate</p>
          </div>
        </div>

        {/* buttons */}
        {homeValuationData.length === 12 && (
          <div onClick={handleRangeButtonClick}>
            {/* 6M */}
            <button
              type='button'
              data-range={6}
              className='px-2 py-1 rounded w-12 range-button'
            >
              6M
            </button>

            {/* 12M */}

            <button
              type='button'
              data-range={12}
              className='px-2 py-1 rounded w-12 range-button range-button__active'
            >
              12M
            </button>
          </div>
        )}
      </div>

      {/* responsive ChartJS container */}
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
    </section>
  );
}

Chart.propTypes = {
  homeValuationData: PropTypes.array.isRequired
};

export default Chart;
