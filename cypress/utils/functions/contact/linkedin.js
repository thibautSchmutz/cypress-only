/**
 * => Generate a random Linkedin URL
 *
 * @params username {string} : 'random'
 *
 * ```js
 * const linkedinUrl = Rd.linkedin({ username })
 * ```
 */
const linkedin = ({ username } = { username: "random" }) =>
  `https://linkedin.com/${username}`;

export { linkedin };
