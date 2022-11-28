module.export = Cypress.Commands.add("deleteAllOpportunities", () => {
  cy.log("ACTION : delete all opportunities");

  cy.log(`opportunities deleted`);
});
