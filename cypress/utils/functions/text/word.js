import { randomize } from "../../helpers/_randomize.js";
import { lorem } from "../../helpers/_lorem.js";

/**
 * => Generate a random word
 *
 * @example
 * ```js
 * const word = Rd.word()
 * ```
 */
const word = () => randomize(lorem);

export { word };
