import createRandomClient from "./_data";

describe("client : has overview", () => {
  let client;

  before(() => {
    client = createRandomClient();

    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));

    cy.createClient(client);

    cy.log("access to created client overview through searchbar");
    cy.visit("/");
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search");
    cy.get("@global_search").type(`${client.firstname} ${client.lastName}`);
    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_result_link"
    );
    cy.get("@client_result_link").click({ force: true });
  });

  it("has an overview with correct infos", () => {
    // ARRANGE

    // ASSERT
    cy.get(".overview-root > header").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );

    cy.getByDataBot("client-overview__menu--general-info").click({
      force: true,
    });

    cy.get("#contentDiv").as("overview_content");
    cy.get("@overview_content").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );
    cy.get("@overview_content").should("contain", client.email);
    cy.get("@overview_content").should("contain", client.social.facebook);
    cy.get("@overview_content").should("contain", client.social.linkedin);
    cy.get("@overview_content").should("contain", client.social.viadeo);
    cy.get("@overview_content").should("contain", client.note);
  });
});
