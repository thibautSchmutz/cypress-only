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
    cy.intercept("GET", "/rest/third/client/init/*").as("get_prospect_infos");

    // ACT
    cy.createProspect(prospect);

    // cy.wait("@get_prospect_infos");

    // // ASSERT
    // cy.get(".mt-0 > .flex-level > .el-tooltip").as("overview_header");
    // cy.get("@overview_header").should(
    //   "contain",
    //   `${prospect.firstname} ${prospect.lastName}`
    // );
  });
});
