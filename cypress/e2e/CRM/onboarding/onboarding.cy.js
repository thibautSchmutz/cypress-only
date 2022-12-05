import createRandomAccount from "./_data";

describe("onboarding", () => {
  let account;

  before(() => {
    account = createRandomAccount();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.logout();
  });

  it("should create an account", () => {
    cy.createAccount(account);

    cy.get("#contentDiv .contentMargin h1").as("welcome_title");
    cy.get("@welcome_title").should("contain", account.firstName);
  });
});
