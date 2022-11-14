import createRandomContact from "./_data";

describe("contact : search", () => {
  let contact;

  before(() => {
    contact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    cy.createContact(contact);
  });

  it("created contact should be found in the global searchbar", () => {
    // ARRANGE
    const searchTerms = `${contact.firstname} ${contact.lastName}`;

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
