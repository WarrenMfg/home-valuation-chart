/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Chart from './Chart';
import { handleErrors } from '../utils';

/**
 * App - stateful functional component
 */
function App() {
  // track home valuation data
  const [homeValuationData, setHomeValuationData] = useState(null);

  // fetch home valuation data on mount
  useEffect(() => {
    const fetchHomeValuationData = async () => {
      try {
        const response = await fetch('/api/home-valuation-data');
        const { data } = await handleErrors(response);
        // unsure of how much data we would actually get back
        setHomeValuationData(data.slice(-12));
      } catch (error) {
        // what to render in this case? no component?
        setHomeValuationData(error);
      }
    };

    // simulate network delay
    setTimeout(fetchHomeValuationData, 1000);
  }, []);

  return (
    <div className='container mx-auto py-8 flex flex-col items-center min-h-screen'>
      {/* use homeValuationData as basis for rendering: */}
      {/* if null, show loader; if error or not adequate length, return null; otherwise, return Chart */}
      {homeValuationData === null ? (
        <Loader />
      ) : homeValuationData instanceof Error ||
        homeValuationData.length < 2 ? null : (
        <Chart homeValuationData={homeValuationData} />
      )}
    </div>
  );
}

export default App;
