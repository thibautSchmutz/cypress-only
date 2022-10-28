module.exports = Cypress.Commands.add("login", (email, password) => {
  cy.intercept("POST", "/web-token").as("login_request");

  cy.log("ACTION: handling authentication");
  cy.session(
    [email, password],
    () => {
      cy.visit(Cypress.env("LOGIN_URL"));

      cy.get("#email").as("email_input");
      cy.get("@email_input").clear().type(email);

      cy.get("#password").as("password_input");
      cy.get("@password_input").clear().type(password);

      cy.get("#submit").as("log_in_button");
      cy.get("@log_in_button").click({ force: true });

      cy.wait("@login_request");

      cy.log("Logged IN");
    },
    {
      validate() {
        cy.visit("/home");
      },
    }
  );
});
