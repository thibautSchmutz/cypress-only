import { SIREN } from "./SIREN.js";

/**
 * => Generate a random TVA intra code
 *
 * @params siren {string | number} : random()
 *
 * @example
 * ```js
 * const TVAintra = Rd.TVAintra()
 * ```
 *
 * @example
 * ```js
 * const TVAintra = Rd.TVAintra({ Siren: 123456789 })
 * ```
 *
 */
const TVAintra = ({ Siren } = { Siren: SIREN() }) => `FR 32 ${Siren}`;

export { TVAintra };
