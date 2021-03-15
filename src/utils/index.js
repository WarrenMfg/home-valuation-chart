export const handleErrors = async res => {
  if (!res.ok) {
    throw await res.json();
  } else {
    return res.json();
  }
};
