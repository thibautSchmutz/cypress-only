export const randomize = (optionsArray) => {
  return optionsArray[Math.floor(Math.random() * optionsArray.length)];
};
