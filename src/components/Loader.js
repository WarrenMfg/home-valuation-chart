import React from 'react';
import loader from '../images/spinner.gif';

function Loader() {
  return (
    <div>
      <img src={loader} width='150' height='150' />
    </div>
  );
}

export default Loader;
