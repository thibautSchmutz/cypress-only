import createRandomProspect from "./_data";

describe("prospect : create", () => {
  let prospect;

  before(() => {
    prospect = createRandomProspect();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllProspects();
  });

  it("should create a propsect", () => {
    // ARRANGE
    cy.intercept("GET", "/rest/third/prospect/init/*").as("get_prospect_infos");

    // ACT
    cy.createProspect({ ...prospect, submitTextBtn: "Enregistrer" });

    cy.wait("@get_prospect_infos", { timeout: 200000 });

    // ASSERT
    cy.get(".mt-0 > .flex-level").as("overview_header");
    cy.get("@overview_header").should("contain", prospect.corpName);
    cy.get("@overview_header").should("contain", "Prospect");
  });
});
