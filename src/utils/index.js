/**
 * Handles fetch API errors
 *
 * @param res The response from the fetch request
 */
export const handleErrors = async res => {
  if (!res.ok) {
    throw await res.json();
  } else {
    return res.json();
  }
};

/**
 * Formats numbers into currency
 *
 * @param data The number to format
 * @param withSign Boolean to indicate if sign (+/-) is desired
 * @param roundToNearestThousand Boolean to indicate if rounding is desired
 */
export const formatValuation = ({ data, withSign, roundToNearestThousand }) => {
  let sign = '';

  if (withSign) {
    sign = data < 0 ? '' : '+'; // browser compatibility hack: .toLocaleString() will add negative sign
  }

  // ensure negative data rounds in the negative direction (e.g. -3500 --> -4000)
  let rounded;
  if (roundToNearestThousand) {
    rounded = Math.round(Math.abs(data / 1000)) * 1000 * (data >= 0 ? 1 : -1);
  } else {
    rounded = Math.round(Math.abs(data)) * (data >= 0 ? 1 : -1);
  }

  return (
    sign +
    rounded.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  ); // do we need to incorporate different currencies?
};
