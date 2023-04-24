export const getTruncatedAddress = (address: string) => {
  if (address.length < 12) {
    return address;
  }
  const lastFour = address.length - 4;
  const samllAddress = address.slice(0, 4) + '...' + address.slice(lastFour);
  return samllAddress;
};
