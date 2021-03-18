import React from 'react';
import loader from '../images/spinner.gif';

/**
 * Loader - functional component
 */
function Loader() {
  return (
    <div className='flex justify-center items-center'>
      <img src={loader} width='150' height='150' />
    </div>
  );
}

export default Loader;
