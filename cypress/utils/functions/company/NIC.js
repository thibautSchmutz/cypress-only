import { randomNumberBetween } from "../../helpers/_randomNumberBetween.js";

/**
 * => Generate a random NIC code
 *
 * @example
 * ```js
 * const NIC = Rd.NIC()
 * ```
 *
 */
const NIC = () => randomNumberBetween({ min: 10001, max: 19999 }).toString();

export { NIC };
