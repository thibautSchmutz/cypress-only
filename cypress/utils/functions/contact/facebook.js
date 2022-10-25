/**
 * => Generate a random facebook URL
 *
 * @params username {string} : 'random'
 *
 * ```js
 * const faceboolUrl = Rd.facebook({ username })
 * ```
 */
const facebook = ({ username } = { username: "random" }) =>
  `https://facebook.com/${username}`;

export { facebook };
