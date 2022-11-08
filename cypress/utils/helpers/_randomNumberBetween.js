/**
 * => Radomally chose a number between a given range
 *
 * @params min {number} 
 * @params max {number} 
 * 
 * @example
 * ```js
 * const year = randomNumber({ min: 1960, max: 2010})
 * ```
 */
 const randomNumberBetween = ({ min, max }) => Math.floor(Math.random() * ( max - min ) + min)

 export { randomNumberBetween };