import createRandomClient from "./_data";

describe("client : delete", () => {
  let client;

  before(() => {
    client = createRandomClient();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.createClient(client);
  });

  it("should be deletable", () => {
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

    cy.wait("@search_results");

    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_result_link"
    );
    cy.get("@client_result_link").click({ force: true });

    cy.wait("@overview_loaded");

    cy.findByText("Actions").as("overview_action_btn");
    cy.get("@overview_action_btn").click({ force: true });

    cy.findByText("Supprimer la société").as("delete_client_option");
    cy.get("@delete_client_option").click({ force: true });

    cy.findByText("Supprimer la société et ses contacts").as(
      "delete_client_and_contacts_btn"
    );
    cy.get("@delete_client_and_contacts_btn").click({ force: true });

    // ASSERT
    cy.get(".listingContainer > .placeholder").as("listing_container");
    cy.get("@listing_container").should("contain", "Aucun résultat");
  });
});
