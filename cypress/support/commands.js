import "@testing-library/cypress/add-commands";
import "cypress-if";

// DO NOT PRINT RESIZE ERRORS
Cypress.on("uncaught:exception", (err) => {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

// OVERWRITES
Cypress.Commands.overwrite(
  "type",
  (originalFn, subject, text, options = {}) => {
    options.delay = 0;
    return originalFn(subject, text, options);
  }
);

// EXTENDS
Cypress.Commands.add("getByDataBot", (dataBotName, ...args) => {
  return cy.get(`[data-bot=${dataBotName}]`, ...args);
});

// CUSTOM COMMANDS
Cypress.Commands.add("login", (email, password) => {
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

// CRM
Cypress.Commands.add(
  "createClient",
  ({
    firstname,
    lastName,
    position,
    email,
    phone,
    mobile,
    social: { twitter, facebook, linkedin, viadeo },
    note,
  }) => {
    // ARRANGE
    cy.intercept("GET", "/rest/third/client/init/*").as("getClientInfos");

    cy.visit("/");

    cy.getByDataBot("menu__contact--client-add").as("open_create_client_btn");
    cy.get("@open_create_client_btn").click({ force: true });

    cy.get("#isPerson").as("individual_checkbox");
    cy.get("@individual_checkbox").click({ force: true });

    cy.get("#thirdcontact_forename").as("firstname_input");
    cy.get("@firstname_input").type(firstname);

    cy.get("#thirdcontact_name").as("lastname_input");
    cy.get("@lastname_input").type(lastName);

    cy.get("#thirdcontact_position").as("job_input");
    cy.get("@job_input").type(position);

    cy.get("#thirdcontact_email").as("email_input");
    cy.get("@email_input").type(email);

    cy.get("#thirdcontact_tel").as("phone_input");
    cy.get("@phone_input").type(phone);

    cy.get("#thirdcontact_mobile").as("mobile_input");
    cy.get("@mobile_input").type(mobile);

    cy.get("#corp_twitter").as("twitter_input");
    cy.get("@twitter_input").type(twitter);

    cy.get("#corp_facebook").as("facebook_input");
    cy.get("@facebook_input").type(facebook);

    cy.get("#corp_linkedin").as("linkedin_input");
    cy.get("@linkedin_input").type(linkedin);

    cy.get("#corp_viadeo").as("viadeo_input");
    cy.get("@viadeo_input").type(viadeo);

    cy.get(".redactor_redactor").as("note_textarea");
    cy.get("@note_textarea").type(note);

    cy.get(".ui-dialog-buttonset > .btn-primary").as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@getClientInfos");
  }
);
