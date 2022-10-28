import createRandomClient from "./_data";

describe("client : find in searchbar", () => {
  let client;

  before(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    client = createRandomClient();
  });

  it("created client should be found in the client listing", () => {
    // ARRANGE
    const searchTerms = `${client.firstname} ${client.lastName}`;

    cy.intercept(
      "GET",
      `*/v2/search?q=${client.firstname}+${client.lastName}`
    ).as("search_results");

    cy.createClient(client);
    cy.visit("/");

    // ACT
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search_input");
    cy.get("@global_search_input").type(searchTerms);

    // ASSERT
    cy.wait("@search_results");
    cy.get(".fast-search-popover").as("dropdown_results");
    cy.get("@dropdown_results").should("contain", searchTerms);
  });
});
