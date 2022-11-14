import createRandomContact from "./_data";

describe("contact : find in listing", () => {
  let contact;

  before(() => {
    contact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    cy.createContact(contact);
  });

  it("created contact should be found in the contact listing", () => {
    // ARRANGE
    cy.intercept("POST", "/listing/people").as("getListingInfos");

    cy.visit("/directory/contacts");
    cy.wait("@getListingInfos");

    // ACT
    cy.get(".leftpane").as("filter_panel");

    /* Check if any active filters, if so clear them */
    cy.get("@filter_panel").then(($panel) => {
      if ($panel.find("a.pull-right.semibold").length) {
        cy.log("Some filters are active");
        cy.get("a.pull-right.semibold").as("filters_reset_btn");
        cy.get("@filters_reset_btn").click({ force: true });
        cy.log("Filters cleared");
      } else {
        cy.log("No active filters");
      }
    });

    cy.get("@filter_panel").contains("Nom").as("name_filter_btn");
    cy.get("@name_filter_btn").click({ force: true });

    cy.get(".form-input > .wp-10").as("filter_input_name");
    cy.get("@filter_input_name").type(contact.lastName);

    cy.get(".acenter > .btn-primary").as("filter_submit_button");
    cy.get("@filter_submit_button").click({ force: true });

    // ASSERT
    cy.get("a.subcell").as("result_row");
    cy.get("@result_row").should(
      "contain",
      `${contact.firstname} ${contact.lastName}`
    );
  });
});
