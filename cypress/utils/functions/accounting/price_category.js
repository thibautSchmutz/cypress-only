import { randomize } from "../../helpers/_randomize.js";

const categories = [
  "BUSINESS-MONTHLY",
  "BUSINESS-MONTHLY-2",
  "BUSINESS-YEARLY",
  "BUSINESS-YEARLY-2",
  "BUSINESSPLUS-MONTHLY",
  "BUSINESSPLUS-MONTHLY-2",
  "BUSINESSPLUS-YEARLY",
  "BUSINESSPLUS-YEARLY-2",
  "DUO-MONTHLY-2",
  "DUO-YEARLY-2",
  "ENTREPRISE",
  "ENTREPRISE-MONTHLY",
  "START-MONTHLY",
  "START-MONTHLY-2",
  "START-YEARLY",
  "START-YEARLY-2",
  "STARTPLUS-MONTHLY",
  "STARTPLUS-MONTHLY-2",
  "STARTPLUS-YEARLY",
  "STARTPLUS-YEARLY-2",
  "Tarifs HT",
  "Tarifs TTC",
];

/**
 * => Pick a random price category
 *
 * @example
 * ```js
 * const priceCategory = Rd.priceCategory()
 * ```
 *
 */
const priceCategory = () => randomize(categories);

export { priceCategory };
