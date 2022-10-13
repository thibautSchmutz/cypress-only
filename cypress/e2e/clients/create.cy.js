import data from "./_data";

describe("individuals : update", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should create a company", () => {
    // ARRANGE
    cy.intercept("GET", "/rest/third/client/init/*").as("getClientInfos");

    // ACT
    cy.get("[data-bot=menu__contact--client-add]").click({ force: true });
    cy.get("#isPerson").click();
    cy.get("#thirdcontact_forename").type(data.firstname);
    cy.get("#thirdcontact_name").type(data.name);
    cy.get("#thirdcontact_position").type(data.position);
    cy.get("#thirdcontact_email").type(data.email);
    cy.get("#thirdcontact_tel").type(data.phone);
    cy.get("#thirdcontact_mobile").type(data.mobile);
    cy.get("#corp_twitter").type(data.social.twitter);
    cy.get("#corp_facebook").type(data.social.facebook);
    cy.get("#corp_linkedin").type(data.social.linkedin);
    cy.get("#corp_viadeo").type(data.social.viadeo);
    cy.get(".redactor_redactor").type(data.note);
    cy.get(".ui-dialog-buttonset > .btn-primary").click({ force: true });

    // cy.intercept("GET", "/rest/third/client/init/*").as("getClientInfos");
    cy.waitReq("@getClientInfos");

    cy.contains(data.name).should("be.visible");
  });
});
