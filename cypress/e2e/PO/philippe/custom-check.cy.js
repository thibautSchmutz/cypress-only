import createClementCustomData from "./_data";

describe("clement : custom check", () => {
  let data;

  before(() => {
    data = createClementCustomData();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllProspects();
  });

  it("create a prospect with opportunity", () => {
    // ARRANGE
    cy.intercept("GET", "/rest/third/prospect/init/*").as("get_prospect_infos");

    cy.createProspect({
      ...data.prospect,
      submitTextBtn: "Enregistrer et créer une opportunité",
    });

    cy.wait("@get_prospect_infos", { timeout: 200000 });

    // ASSERT
    cy.get(".mt-0 > .flex-level").as("overview_header");
    cy.get("@overview_header").should("contain", data.prospect.corpName);
    cy.get("@overview_header").should("contain", "Prospect");

    cy.get(".popup-panel").as("create_opportunity_panel");
    cy.get("@create_opportunity_panel").should(
      "contain",
      "Créer une opportunité"
    );
  });
});
