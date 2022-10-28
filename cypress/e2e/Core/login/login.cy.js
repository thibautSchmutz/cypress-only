describe("Login", () => {
  it("should be redirected to homepage after logging in", () => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));

    cy.url().should(($url) => {
      expect($url).to.contain("/home");
    });
  });
});
