import { randomize } from "../../helpers/_randomize.js";

const status = ["EIRL", "EURL", "SAS", "SA", "SARL", "SASU"];

/**
 * => Pick a random legal status
 *
 * @example
 * ```js
 * const legalStatus = Rd.legalStatus()
 * ```
 *
 */
const legalStatus = () => randomize(status);

export { legalStatus };
