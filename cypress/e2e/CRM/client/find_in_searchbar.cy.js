import createRandomClient from "./_data";

describe("client : find in searchbar", () => {
  let client;

  before(() => {
    client = createRandomClient();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.createClient(client);
  });

  it("created client should be found in the client listing", () => {
    // ARRANGE
    const searchTerms = `${client.firstname} ${client.lastName}`;

    cy.intercept("GET", `https://api.slsy.io/v2/search?q=*`).as(
      "search_results"
    );

    // ACT
    cy.visit("/");

    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search_input");
    cy.get("@global_search_input").type(searchTerms);

    cy.wait("@search_results");

    // ASSERT
    cy.get(".fast-search-popover").as("dropdown_results");
    cy.get("@dropdown_results").should("contain", searchTerms);
  });
});
