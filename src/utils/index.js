export const handleErrors = async res => {
  if (!res.ok) {
    throw await res.json();
  } else {
    return res.json();
  }
};

export const formatValuation = (data, withSign) => {
  let sign = '';

  if (withSign) {
    sign = data < 0 ? '' : '+'; // browser compatibility hack: .toLocaleString() will add negative sign
  }

  const rounded = Math.round(data); // NOTE: -1000.5 rounds to -1000

  return (
    sign +
    rounded.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  ); // do we need to incorporate different currencies?
};
