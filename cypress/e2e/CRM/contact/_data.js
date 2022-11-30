import Rd from "../../../utils/index.js";


const createRandomContact = () => {
  const username = Rd.word();

  return {
    firstname: Rd.firstName(),
    lastName: Rd.lastName(),
    position: Rd.job(),
    email: Rd.email({ username }),
    dateOfBirth: new Date().toLocaleDateString(Cypress.env("DATE_FORMAT") === "DD/MM/YYYY" ? "fr": "en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }),
    phone: Rd.phone({ country: "FR" }),
    mobile: Rd.phone({ country: "FR", type: "mobile" }),
    social: {
      twitter: username,
      facebook: Rd.facebook({ username }),
      linkedin: Rd.linkedin({ username }),
    },
    note: Rd.sentence(),
  };
};

export default createRandomContact;