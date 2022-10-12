import data from "./_data";

describe("individuals : update", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should update a user", () => {
    // ARRANGE
    cy.visit("/individuals/create");
  });
});
