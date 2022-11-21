import createCustomCheckData from "./_data";

describe("clement : custom check", () => {
  let data;

  before(() => {
    data = createCustomCheckData();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("coucou", () => {
    cy.intercept("GET", "/home/init").as("saas_init");
    cy.intercept("POST", "/?_f=third").as("create_prospect_modal_renders");

    cy.visit("/");
    cy.wait("@saas_init");

    cy.getByDataBot("menu__contact--prospect-add").as(
      "open_create_prospect_btn"
    );
    cy.get("@open_create_prospect_btn").click({ force: true });

    cy.wait("@create_prospect_modal_renders");

    cy.screenshot("clement/1_create_prospect_modal");
  });
});
