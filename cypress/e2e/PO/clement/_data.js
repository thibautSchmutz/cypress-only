import Rd from "../../../utils/index.js";

export const generateProspectData = () => {
  const corpName = Rd.word();
  const corpReference = Rd.word();
  const corpWebsite = `https://www.${corpName}.fr`;
  const corpPriceCategory = Rd.priceCategory();
  const corpPhone = Rd.phone({ country: "FR" });
  const corpMobile = Rd.phone({ country: "FR", type: "mobile" });
  const corpEmail = Rd.email({ username: corpName });
  const corpLegalStatus = Rd.legalStatus();
  const corpSIRET = Rd.SIRET();
  const corpSIREN = Rd.SIREN();
  const corpAPE = Rd.APE();
  const corpCapitalStock = "100000";
  const corpRCS = Rd.RCS();
  const corpTVAintra = Rd.TVAintra({ Siren: corpSIREN });
  const corpTwitter = corpName;
  const corpFacebook = Rd.facebook({ username: corpName });
  const corpLinkedin = Rd.linkedin({ username: corpName });
  const corpNote = Rd.sentence({ length: 10 });

  const contactFirstName = Rd.firstName();
  const contactLastName = Rd.lastName();
  const contactJob = Rd.job();
  const contactEmail = Rd.email({ username: contactFirstName });
  const contactPhone = Rd.phone({ country: "FR" });
  const contactMobile = Rd.phone({ country: "FR", type: "mobile" });

  return {
    corpName,
    corpReference,
    corpWebsite,
    corpPriceCategory,
    corpPhone,
    corpMobile,
    corpEmail,

    contactFirstName,
    contactLastName,
    contactJob,
    contactEmail,
    contactPhone,
    contactMobile,

    corpLegalStatus,
    corpSIRET,
    corpSIREN,
    corpAPE,
    corpCapitalStock,
    corpRCS,
    corpTVAintra,

    corpTwitter,
    corpFacebook,
    corpLinkedin,

    corpNote,
  };
};

export const generateOpportunityData = () => {
  const name = Rd.word();
  const potentialAmount = 15000;
  const probability = 40;
  const note = Rd.sentence({ length: 10 });

  return {
    name,
    potentialAmount,
    probability,
    note,
  };
};

export const generateDocumentData = () => {
  const unitAmount = "120,00";

  return {
    unitAmount,
  };
};
