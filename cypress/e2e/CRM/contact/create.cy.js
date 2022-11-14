import createRandomContact from "./_data";

describe("contact : create", () => {
  let contact;

  before(() => {
    contact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    // TODO : create command deleteAllContacts
  });

  it("should create a contact", () => {
    // ARRANGE
    cy.intercept("GET", "/rest/people/init/*").as("get_contact_info");

    // ACT
    cy.createContact(contact);

    cy.wait("@get_contact_info");

    // ASSERT
    cy.get(".mt-0 > .flex-level > .el-tooltip").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${contact.firstname} ${contact.lastName}`
    );
  });
});
