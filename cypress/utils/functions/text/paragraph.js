import Rd from "../../index.js";

/**
 * => Generate a random paragraph
 *
 * @params length {number} : 5
 * (number of sentences included in the paragraph)
 *
 * @example
 * ```js
 * const paragraph = Rd.paragraph()
 * ```
 * @example
 * ```js
 * const paragraph = Rd.paragraph({ length: 10 })
 * ```
 */
const paragraph = ({ length } = { length: 5 }) => {
  const sentences = [];

  for (let index = 0; index < length; index++) {
    sentences.push(Rd.sentence());
  }

  return sentences.join(" ");
};

export { paragraph };
