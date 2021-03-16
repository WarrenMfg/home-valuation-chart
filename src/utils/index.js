export const handleErrors = async res => {
  if (!res.ok) {
    throw await res.json();
  } else {
    return res.json();
  }
};

export const formatValuation = data => {
  const sign = data < 0 ? '' : '+';
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
