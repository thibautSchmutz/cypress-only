import { randomNumberBetween } from "../../helpers/_randomNumberBetween.js";

/**
 * => Generate a random SIREN code
 *
 * @example
 * ```js
 * const SIREN = Rd.SIREN()
 * ```
 *
 */
const SIREN = () =>
  randomNumberBetween({ min: 784000001, max: 784999999 }).toString();

export { SIREN };
