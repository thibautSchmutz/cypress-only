import createRandomAccount from "./_data";

describe("Login with new user", () => {
  let account;

  before(() => {
    account = createRandomAccount();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.logout();
    cy.createAccount(account);
  });

  it("should have to log twice", () => {
    cy.login(account.email, account.password);

    cy.url().should(($url) => {
      expect($url).to.contain("/home");
    });
  });
});
