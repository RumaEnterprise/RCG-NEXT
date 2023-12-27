const capitalizeWords = (inputString) => {
  if (inputString == undefined) {
    return "";
  }
  let words = inputString.split(" ");
  let capitalizedWords = [];

  for (let word of words) {
    if (word.length > 0) {
      let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      capitalizedWords.push(capitalizedWord);
    }
  }

  return capitalizedWords.join(" ");
};
export { capitalizeWords };
