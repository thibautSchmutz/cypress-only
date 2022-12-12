import createRandomContact from "./_data";

describe("contact : has overview", () => {
  let contact;

  before(() => {
    contact = createRandomContact();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllContacts();
    cy.createContact(contact);
  });

  it("has an overview with correct infos", () => {
    const searchTerms = `${contact.firstname} ${contact.lastName}`;

    cy.intercept("GET", `https://api.slsy.io/v2/search?q=*`).as(
      "search_results"
    );
    cy.intercept("GET", "https://api.slsy.io/v2/staffs*").as("overview_loaded");

    // ACT
    cy.visit("/");

    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search_input");
    cy.get("@global_search_input").type(searchTerms);

    cy.wait("@search_results", { timeout: 200000 });

    cy.get(".search-result-item")
      .contains(`${contact.firstname} ${contact.lastName}`)
      .as("contact_link");

    cy.get("@contact_link").click({ force: true });

    cy.wait("@overview_loaded", { timeout: 200000 });

    // ASSERT
    cy.get(".overview-root > header").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${contact.firstname} ${contact.lastName}`
    );

    cy.getByDataBot("contact-overview__menu--general-info").as(
      "overview_general_infos_btn"
    );
    cy.get("@overview_general_infos_btn").click({
      force: true,
    });

    cy.get("#contentDiv").as("overview_content");
    cy.get("@overview_content").should(
      "contain",
      `${contact.firstname} ${contact.lastName}`
    );

    cy.get("@overview_content").should("contain", contact.phone);
    cy.get("@overview_content").should("contain", contact.mobile);
    cy.get("@overview_content").should("contain", contact.email);
    cy.get("@overview_content").should("contain", contact.social.facebook);
    cy.get("@overview_content").should("contain", contact.social.linkedin);
    cy.get("@overview_content").should("contain", contact.note);
  });
});
