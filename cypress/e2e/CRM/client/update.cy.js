// import data from "./_data";

describe("companie : delete", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should create a company", () => {
    // ARRANGE
    cy.visit("/home");
  });
});
