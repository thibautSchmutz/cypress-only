import { randomize } from "../../helpers/_randomize.js";

const options = ["QA", "developer", "designer", "CTO", "Manager"];

/**
 * => Generate a random job position
 *
 * @example
 * ```js
 * const job = Rd.job()
 * ```
 */
const job = () => randomize(options);

export { job };
