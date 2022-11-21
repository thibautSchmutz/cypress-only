import { randomize } from "../../helpers/_randomize.js";

const cities = [
  { name: "Fouras", code: 17450 },
  { name: "La Rochelle", code: 17000 },
  { name: "Ondres", code: 40440 },
  { name: "Dax", code: 40100 },
  { name: "Bordeaux", code: 33000 },
];

/**
 * => Pick a random city and code
 *
 * @example
 * ```js
 * const { city, code } = Rd.city()
 * ```
 */
const city = () => randomize(cities);

export { city };
