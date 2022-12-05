const OPTIONS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "1234567890",
  // specialCharacters: "!@#$%^&*()",
};

const generatePassword = (length, options = {}) => {
  const optionsKeysLength = Object.keys(options).length;

  if (optionsKeysLength === 0) {
    throw new Error("NOT_ENOUGH_OPTIONS");
  }

  if (optionsKeysLength > length) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const password = [];
  let characters = "";

  for (const property in options) {
    characters += OPTIONS[property];
    password.push(randomChar(OPTIONS[property]));
  }

  for (let i = optionsKeysLength; i < length; i++) {
    password.push(randomChar(characters));
  }

  return shuffleArray(password).join("");
};

const randomChar = (string) =>
  string[Math.floor(Math.random() * string.length)];
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

/**
 * => Generate a random password
 *
 * @example
 * ```js
 * const password = Rd.password()
 * ```
 */
const password = () => generatePassword(8, OPTIONS);

export { password };
