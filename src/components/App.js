import React from 'react';
import Chart from './Chart';

function App() {
  return (
    <div className='container mx-auto flex flex-col justify-center items-center min-h-screen'>
      <h1 className='text-xl'>Home Valuation Chart</h1>
      <Chart />
    </div>
  );
}

export default App;
