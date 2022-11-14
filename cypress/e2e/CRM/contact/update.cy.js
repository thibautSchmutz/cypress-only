import createRandomContact from "./_data";

describe("contact : update", () => {
  let contact;
  let newContact;

  beforeEach(() => {
    contact = createRandomContact();
    newContact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    cy.createContact(contact);
  });

  it("should be updatable", () => {
    // ARRANGE
    const searchTerms = `${contact.firstname} ${contact.lastName}`;

    cy.intercept("GET", `https://api.slsy.io/v2/search?q=*`).as(
      "search_results"
    );
    cy.intercept("GET", "/rest/people/init/*").as("get_contact_infos");
    cy.intercept("POST", "/?_f=people").as("update_contact_modal");

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

    cy.get("li").contains("Modifier le contact").as("update_contact_btn");
    cy.get("@update_contact_btn").click({ force: true });

    cy.wait("@update_contact_modal");

    cy.get("#people_forename").as("firstname_contact_input");
    cy.get("@firstname_contact_input").clear().type(newContact.firstname);

    cy.intercept("GET", "/rest/people/init/*").as("get_contact_updated_infos");

    cy.get(".ui-dialog-buttonset button")
      .contains("Enregistrer")
      .as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@get_contact_updated_infos", { timeout: 200000 });

    // ASSERT
    cy.get(".mt-0 > .flex-level > .el-tooltip").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${newContact.firstname} ${contact.lastName}`
    );
  });
});
