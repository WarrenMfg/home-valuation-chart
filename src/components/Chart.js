/* eslint-disable no-console */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { formatValuation } from '../utils';
import { useChartJS } from '../hooks';

import './styles/Chart.css';

/**
 * Chart - stateful functional component
 *
 * @param props.homeValuationData Array of objects, each containing data for one month
 */
function Chart({ homeValuationData }) {
  // track canvas element to .getContext()
  const canvasRef = useRef(null);
  // track chart to destroy old chart and generate new chart on range change
  const chartRef = useRef(null);
  // track last 30 days home value estimate
  const [estimate, setEstimate] = useState('Not enough data yet.');
  // track the home valuation data that the user has selected; default to incoming data
  const [selectedHomeValuationData, setSelectedHomeValuationData] = useState([
    ...homeValuationData
  ]);

  // calculate home valuation estimate in last 30 days
  useEffect(() => {
    // if enough data to calculate
    if (homeValuationData.length >= 2) {
      // destructure lastMonth and currentMonth
      const [
        { valuation: lastMonth = 0 },
        { valuation: currentMonth = 0 }
      ] = homeValuationData.slice(-2);

      // calculate difference
      const diff = currentMonth - lastMonth;
      let percentDiff;

      // if percent change is < 1%, calculate float percentDiff
      if (Math.abs(diff / currentMonth) < 0.01) {
        percentDiff = diff
          ? (Math.round(Math.abs((diff / currentMonth) * 1000)) / 10) *
            (diff >= 0 ? 1 : -1)
          : 0;
        // otherwise, calculate rounded integer percentDiff
      } else {
        percentDiff = diff
          ? Math.round(Math.abs((diff / currentMonth) * 100)) *
            (diff >= 0 ? 1 : -1)
          : 0;
      }

      setEstimate(
        `${formatValuation({
          data: diff,
          withSign: true,
          roundToNearestThousand: true
        })} (${percentDiff}%)`
      );
    } // TODO: if estimate is negative, still show this info? If so, same color?
  }, [homeValuationData]);

  // custom effect hook to create/destroy chart
  useChartJS({
    canvasRef,
    chartRef,
    selectedHomeValuationData
  });

  /**
   * Range buttons delegated click event handler
   *
   * @param event Synthetic event object
   */
  const handleRangeButtonClick = ({ target }) => {
    // if click on active button, return
    if (target.classList.contains('range-button__active')) return;

    // remove from currently active button
    [...target.parentElement.children].forEach(child =>
      child.classList.remove('range-button__active')
    );
    // make target the active button
    target.classList.add('range-button__active');

    let selectedHomeValuationData;

    // hard coded here and in markup
    if (target.dataset.range == 12) {
      selectedHomeValuationData = homeValuationData;
    } else if (target.dataset.range == 6) {
      selectedHomeValuationData = homeValuationData.slice(-6);
    }

    // update state
    setSelectedHomeValuationData(selectedHomeValuationData);
    // blur outline
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
            {/* line container */}
            <div className='flex items-center mr-4 line-container'>
              <div className='rounded-full w-1.5 h-1.5'></div>
              <div className='w-6 h-0.5'></div>
              <div className='rounded-full w-1.5 h-1.5'></div>
            </div>
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

        {/* buttons (only shown if enough data) */}
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
