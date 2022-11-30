import Rd from "./cypress/utils/index.js";

const username = Rd.word();

const data = {
  firstName: Rd.firstName(),
  lastName: Rd.lastName(),
  dateOfBirth: Rd.date({ format: "DD/MM/YYYY" }),
  job: Rd.job(),
  email: Rd.email({ username }),
  phone: Rd.phone({ country: "FR" }),
  mobilePhone: Rd.phone({ country: "FR", type: "mobile" }),
  socials: {
    twitter: username,
    facebook: Rd.facebook({ username }),
    linkedin: Rd.linkedin({ username }),
    viadeo: Rd.viadeo({ username }),
  },
  word: Rd.word(),
  sentence: Rd.sentence(),
  paragraph: Rd.paragraph(),
};

console.log(data);

// console.log(Rd.legalStatus());
// console.log(Rd.SIREN());
// console.log(Rd.NIC());
// console.log(Rd.SIRET());
// console.log(Rd.APE());
