module.exports = Cypress.Commands.add("login", (email, password) => {
  cy.intercept("GET", "/home/init").as("login_request");

  cy.log("ACTION: handling authentication");

  cy.session(
    [email, password],
    () => {
      cy.visit(Cypress.env("LOGIN_URL"));
      cy.get("#email").as("email_input");
      cy.get("@email_input").clear().type(email);

      cy.get("#password").as("password_input");
      cy.get("@password_input").clear().type(password);

      cy.get("#submit").as("log_in_submit_button");
      cy.get("@log_in_submit_button").click();

      cy.get("body").as("body_DOM_element");

      // Login in with new user (it has a bug, you need to log in twice)
      // TODO : remove this block when issue is fixed (Jira n°: ... )
      cy.get("@body_DOM_element").then(($body) => {
        if ($body.find(".login__title:contains('Log In')").length) {
          cy.get("@email_input").clear().type(email);
          cy.get("@password_input").clear().type(password);
          cy.get("@log_in_submit_button").click();
        }
      });

      // cy.get("body").as("body_DOM_element");
      cy.get("@body_DOM_element").then(($body) => {
        if ($body.find("h2:contains('Two-factor authentication')").length) {
          cy.task("generateOTP", Cypress.env("TWO_FA_VERIFICATION_CODE")).then(
            (token) => {
              cy.get("#_auth_code").as("2FA_code_input");
              cy.get("@2FA_code_input").clear().type(token);

              cy.get("button[type=submit]").as("2FA_submit_button");
              cy.get("@2FA_submit_button").click();
            }
          );
        }
      });

      cy.wait("@login_request", { timeout: 200000 });

      cy.log("Logged IN");
    },
    {
      validate() {
        cy.visit("/home");
      },
    }
  );
});
