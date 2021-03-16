import React from 'react';
import Chart from './Chart';

function App() {
  return (
    <div className='container mx-auto flex flex-col items-center min-h-screen'>
      <h1 className='text-xl mt-56'>Home Valuation Chart</h1>
      <Chart />
    </div>
  );
}

export default App;
