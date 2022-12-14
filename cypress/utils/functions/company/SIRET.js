import { SIREN } from "./SIREN.js";
import { NIC } from "./NIC.js";

/**
 * => Generate a random SIRET code
 *
 * @example
 * ```js
 * const SIRET = Rd.SIRET()
 * ```
 *
 */
const SIRET = () => `${SIREN()}${NIC()}`;

export { SIRET };
