import data from "./_data";

describe("individuals : update", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should create a corp", () => {
    // ARRANGE
    cy.visit("/individuals/create");
  });
});
