import { SIREN } from "./SIREN.js";

/**
 * => Generate a random RCS code
 *
 * @params city {string} : 'BORDEAUX'
 * @params type {"A" | "B"} : 'B'
 *
 * @example
 * ```js
 * const RCS = Rd.RCS()
 * ```
 * @example
 * ```js
 * const RCS = Rd.RCS({ city: "LA ROCHELLE", type: "individual" })
 * ```
 *
 */
const RCS = ({ city, type } = { city: "bordeaux", type: "B" }) =>
  `RCS ${city.toUpperCase()} ${type} ${SIREN()}`;

export { RCS };
