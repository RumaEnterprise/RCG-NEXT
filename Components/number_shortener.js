const shortenNumber = (number) => {
  if (number == undefined) {
    number = 0;
  }
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(2) + "K";
  } else if (number >= 1000000 && number < 1000000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2) + "B";
  } else {
    return number.toString();
  }
};
export { shortenNumber };
