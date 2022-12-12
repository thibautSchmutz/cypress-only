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

    // cy.intercept("GET", "/home/init").as("login_request");

    // cy.visit(Cypress.env("LOGIN_URL"));
    // cy.get("#email").as("email_input");
    // cy.get("@email_input").clear().type(account.email);

    // cy.get("#password").as("password_input");
    // cy.get("@password_input").clear().type(account.password);

    // cy.get("#submit").as("log_in_submit_button");
    // cy.get("@log_in_submit_button").click();

    // cy.get("body").as("body_DOM_element");

    // // Login in with new user (it has a bug, you need to log in twice)
    // // TODO : remove this block when issue is fixed
    // cy.get("@body_DOM_element").then(($body) => {
    //   if ($body.find(".login__title:contains('Log In')").length) {
    //     cy.get("@email_input").clear().type(account.email);
    //     cy.get("@password_input").clear().type(account.password);
    //     cy.get("@log_in_submit_button").click();
    //   }
    // });

    // // 2FA is activated
    // cy.get("@body_DOM_element").then(($body) => {
    //   if ($body.find("h2:contains('Two-factor authentication')").length) {
    //     cy.task("generateOTP", Cypress.env("TWO_FA_VERIFICATION_CODE")).then(
    //       (token) => {
    //         cy.get("#_auth_code").as("2FA_code_input");
    //         cy.get("@2FA_code_input").clear().type(token);

    //         cy.get("button[type=submit]").as("2FA_submit_button");
    //         cy.get("@2FA_submit_button").click();
    //       }
    //     );
    //   }
    // });

    // // GET 200 https://login.slsy.io/_wdt/6a5bde

    // cy.wait("@login_request");

    // cy.log("Logged IN");

    cy.url().should(($url) => {
      expect($url).to.contain("/home");
    });
  });
});
