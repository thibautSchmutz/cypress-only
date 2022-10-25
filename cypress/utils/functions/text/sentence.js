import { randomize } from "../../helpers/_randomize.js";
import { lorem } from "../../helpers/_lorem.js";

/**
 * => Generate a random sentence
 *
 * @params length {number} : 7
 * (number of words included in the sentence)
 *
 * @example
 * ```js
 * const sentence = Rd.sentence()
 * ```
 * @example
 * ```js
 * const sentence = Rd.sentence({ length: 5 })
 * ```
 */
const sentence = ({ length } = { length: 7 }) => {
  const words = [];

  for (let index = 0; index < length; index++) {
    words.push(randomize(lorem));
  }

  const sentence = words.join(" ");

  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
};

export { sentence };
