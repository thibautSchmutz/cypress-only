import Rd from "../../../utils/index.js";

const createRandomClient = () => {
  const username = Rd.word();

  return {
    firstname: Rd.firstName(),
    lastName: Rd.lastName(),
    position: Rd.job(),
    email: Rd.email({ username }),
    phone: Rd.phone({ country: "FR" }),
    mobile: Rd.phone({ country: "FR", type: "mobile" }),
    social: {
      twitter: username,
      facebook: Rd.facebook({ username }),
      linkedin: Rd.linkedin({ username }),
      viadeo: Rd.viadeo({ username }),
    },
    note: Rd.sentence(),
  };
};

export default createRandomClient;
