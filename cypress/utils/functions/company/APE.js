import { randomNumberBetween } from "../../helpers/_randomNumberBetween.js";
import { randomize } from "../../helpers/_randomize.js";
import { uppercaseLetters } from "../../helpers/_caracters.js";

/**
 * => Generate a random APE code
 *
 * @example
 * ```js
 * const APE = Rd.APE()
 * ```
 *
 */
const APE = () =>
  `${randomNumberBetween({ min: 11, max: 99 })}.${randomNumberBetween({
    min: 11,
    max: 99,
  })}${randomize(uppercaseLetters)}`;

export { APE };
