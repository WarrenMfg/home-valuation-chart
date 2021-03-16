/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Chart from './Chart';
import { handleErrors } from '../utils';

function App() {
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
