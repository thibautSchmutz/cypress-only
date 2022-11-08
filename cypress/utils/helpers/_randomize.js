/**
 * => Radomally pick one option based on an array of options
 *
 * @params options {array} 
 * 
 * @example
 * ```js
 * const randomOption = randomize(['A', 'B', 'C'])
 * ```
 */
export const randomize = (optionsArray) => {
  return optionsArray[Math.floor(Math.random() * optionsArray.length)];
};
