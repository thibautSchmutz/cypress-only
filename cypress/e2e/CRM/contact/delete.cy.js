import createRandomContact from "./_data";

describe("contact : delete", () => {
  let contact;

  before(() => {
    contact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    cy.createContact(contact);
  });

  it("should be deletable", () => {
    // ARRANGE
    const searchTerms = `${contact.firstname} ${contact.lastName}`;
    cy.intercept("GET", `https://api.slsy.io/v2/search?q=*`).as(
      "search_results"
    );
    cy.intercept("GET", "/rest/people/init/*").as("get_contact_infos");
    cy.intercept("POST", "/?_f=people").as("delete_contact_confirmation_modal");
    cy.intercept("POST", "/listing/people").as("contact_listing_page_renders");

    // ACT
    cy.visit("/");

    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search_input");
    cy.get("@global_search_input").type(searchTerms);

    cy.wait("@search_results");

    cy.get(".search-result-item")
      .contains(`${contact.firstname} ${contact.lastName}`)
      .as("contact_link");

    cy.get("@contact_link").click({ force: true });

    cy.wait("@get_contact_infos");

    cy.get(".slsy-button").contains("Actions").as("actions_btn");
    cy.get("@actions_btn").click({ force: true });

    cy.get("li").contains("Supprimer le contact").as("delete_contact_btn");
    cy.get("@delete_contact_btn").click({ force: true });

    cy.wait("@delete_contact_confirmation_modal");

    cy.get(".ui-dialog button").contains("Oui").as("confirm_btn");
    cy.get("@confirm_btn").click({ force: true });

    cy.wait("@contact_listing_page_renders");

    cy.get(".listingContainer").as("listing_container");
    cy.get("@listing_container").should("contain", "Aucun résultat");
  });
});
