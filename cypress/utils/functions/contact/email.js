import { randomize } from "../../helpers/_randomize.js";

const extensions = ["sellsy.com", "gmail.com", "yahoo.fr", "apple.com"];

/**
 * => Generate a random email address
 *
 * @params username {string} : 'random'
 *
 * @example
 * ```js
 * const email = Rd.email() // will use 'random' as username
 * ```
 * @example
 * ```js
 * const email = Rd.email({ username: 'toto' })
 * ```
 *
 */
const email = ({ username } = { username: "random" }) =>
  `${username}@${randomize(extensions)}`;

export { email };
