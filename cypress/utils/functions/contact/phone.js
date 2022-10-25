import { randomize } from "../../helpers/_randomize.js";

const countries = {
  FR: {
    base: ["+", "3", "3", " "],
    numbersToGenerate: 8,
    addSpacingEach: 2,
    startsWith: {
      default: ["1", "2", "3", "4", "5", "8", "9"],
      mobile: ["6", "7"],
    },
  },
};

/**
 * => Generate a random phone number
 *
 * @params country {string}
 * @params type {string} : 'default'
 *
 * @example
 * ```js
 * const phone = Rd.phone({ country: 'FR' })
 * ```
 *
 * @example
 * ```js
 * const mobilePhone = Rd.phone({ country: 'FR', type: 'mobile' })
 * ```
 */
const phone = ({ country, type = "default" }) => {
  const { base, numbersToGenerate, addSpacingEach, startsWith } =
    countries[country];

  const result = [...base];

  // First number
  result.push(randomize(startsWith[type]), " ");

  for (let i = 0; i < numbersToGenerate; i++) {
    // Numbers
    result.push(Math.round(Math.random() * 9));
    // Spacings
    if ((i + 1) % addSpacingEach === 0) result.push(" ");
  }

  return result.join("").trim();
};

export { phone };
