import "@testing-library/cypress/add-commands";

/* ------------ */
/* ----CORE---- */
/* ------------ */
//   login
import "../e2e/Core/login/commands/login.js";
//   logout
import "../e2e/Core/logout/commands/logout.js";

/* ------------- */
/* -----CRM----- */
/* ------------- */
//   client
import "../e2e/CRM/client/commands/createClient.js";
import "../e2e/CRM/client/commands/deleteAllClients.js";

//   contact
import "../e2e/CRM/contact/commands/createContact.js";
import "../e2e/CRM/contact/commands/deleteAllContacts.js";

//   prospect
import "../e2e/CRM/prospect/commands/deleteAllProspects.js";
import "../e2e/CRM/prospect/commands/createProspect.js";
import "../e2e/CRM/prospect/commands/selectProspect.js";

// corp

// opportunity
import "../e2e/CRM/opportunity/commands/deleteAllOpportunities.js";
import "../e2e/CRM/opportunity/commands/selectOpportunity.js";

// onboarding
import "../e2e/CRM/onboarding/commands/createAccount.js";

// DO NOT PRINT RESIZE ERRORS
Cypress.on("uncaught:exception", (err) => {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

// OVERWRITES
Cypress.Commands.overwrite(
  "type",
  (originalFn, subject, text, options = {}) => {
    options.delay = 0;
    return originalFn(subject, text, options);
  }
);

// EXTENDS
Cypress.Commands.add("getByDataBot", (dataBotName, ...args) => {
  return cy.get(`[data-bot=${dataBotName}]`, ...args);
});
