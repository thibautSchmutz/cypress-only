/**
 * => Generate a random Viadeo URL
 *
 * @params username {string} : 'random'
 *
 * ```js
 * const viadeoUrl = Rd.viadeo({ username })
 * ```
 */
const viadeo = ({ username } = { username: "random" }) =>
  `https://viadeo.com/${username}`;

export { viadeo };
