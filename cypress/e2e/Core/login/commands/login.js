module.exports = Cypress.Commands.add("login", (email, password) => {
  cy.log("ACTION: handling authentication");
  cy.session(
    [email, password],
    () => {
      cy.visit(Cypress.env("LOGIN_URL"));
      cy.get("#email").clear().type(email);
      cy.get("#password").clear().type(password);
      cy.get("#submit").click();
      cy.url().should(($url) => {
        expect($url).to.contain("/home");
      });
    },
    {
      validate() {
        cy.visit("/home");
      },
    }
  );
});
