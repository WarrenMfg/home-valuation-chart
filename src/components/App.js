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
  const [homeValuationData, setHomeValuationData] = useState([]);

  // fetch home valuation data on mount
  useEffect(() => {
    const fetchHomeValuationData = async () => {
      try {
        const response = await fetch('/api/home-valuation-data');
        const { data } = await handleErrors(response);
        setHomeValuationData(data.slice(-12)); // unsure of how much data we would actually get back
      } catch (error) {
        console.error(error);
        // what to render in this case?
      }
    };

    // simulate network delay
    setTimeout(fetchHomeValuationData, 1000);
  }, []);

  return (
    <div className='container mx-auto py-8 flex flex-col items-center min-h-screen'>
      {homeValuationData.length === 0 ? (
        <Loader />
      ) : (
        <Chart homeValuationData={homeValuationData} />
      )}
    </div>
  );
}

export default App;
