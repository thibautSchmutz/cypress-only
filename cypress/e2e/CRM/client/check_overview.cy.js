import createRandomClient from "./_data";

describe("client : has overview", () => {
  let client;

  before(() => {
    client = createRandomClient();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.createClient(client);
  });

  it("has an overview with correct infos", () => {
    const searchTerms = `${client.firstname} ${client.lastName}`;

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

    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_result_link"
    );
    cy.get("@client_result_link").click({ force: true });

    cy.wait("@overview_loaded", { timeout: 200000 });

    // ASSERT
    cy.get(".overview-root > header").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );

    cy.getByDataBot("client-overview__menu--general-info").as(
      "overview_general_infos_btn"
    );
    cy.get("@overview_general_infos_btn").click({
      force: true,
    });

    cy.get("#contentDiv").as("overview_content");
    cy.get("@overview_content").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );

    cy.get("@overview_content").should("contain", client.phone);
    cy.get("@overview_content").should("contain", client.mobile);
    cy.get("@overview_content").should("contain", client.email);
    cy.get("@overview_content").should("contain", client.social.facebook);
    cy.get("@overview_content").should("contain", client.social.linkedin);
    cy.get("@overview_content").should("contain", client.social.viadeo);
    cy.get("@overview_content").should("contain", client.note);
  });
});
