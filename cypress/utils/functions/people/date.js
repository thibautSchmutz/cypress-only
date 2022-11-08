import { randomNumberBetween } from "../../helpers/_randomNumberBetween.js"

const generateYear = () =>randomNumberBetween({ min: 1940, max: 2005 }).toString()


const generateMonth = () => {
    // const randomMonth = Math.floor(Math.random() * 11 + 1).toString()
    const randomMonth = randomNumberBetween({ min: 1, max: 12 }).toString()
    if(randomMonth.length === 1) {
        return `0${randomMonth}`
    }
    return randomMonth;
}

const generateDay = () => {
    const randomDay = randomNumberBetween({ min: 1, max: 28 }).toString()
    if(randomDay.length === 1 ) {
        return `0${randomDay}`
    }
    return randomDay;
}

/**
 * => Generate a random date
 * 
 * @params format {string}
 *
 * @example
 * ```js
 * const date = Rd.date({ format: "DD/MM/YYYY" })
 * ```
 * @example
 * ```js
 * const date = Rd.date({ format: "MM/DD/YYYY" })
 * ```
 */
const date = ({ format }) => {

    return format
        .replace("DD", generateDay())
        .replace("MM", generateMonth())
        .replace("YYYY", generateYear())
};

export { date };
