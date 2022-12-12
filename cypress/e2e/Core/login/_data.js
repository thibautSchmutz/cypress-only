import Rd from "../../../utils/index.js";

const createRandomAccount = () => {
  const username = Rd.word();

  return {
    companyName: Rd.word(),
    firstName: Rd.firstName(),
    lastName: Rd.lastName(),
    email: Rd.email({ username }),
    phone: Rd.phone({ country: "FR" }),
    password: Rd.password(),
  };
};

export default createRandomAccount;
