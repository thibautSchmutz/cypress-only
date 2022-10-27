import createRandomClient from "./_data";

describe("client : create", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  const client = createRandomClient();

  it("should create a client", () => {
    cy.createClient(client);
  });


    // ACT
    // cy.get("@filter_panel").contains("Nom").as("name_filter_btn");
    // cy.get("@name_filter_btn").click({ force: true });

    // cy.get(".form-input > .wp-10").as("filter_input_name");
    // cy.get("@filter_input_name").type(client.lastName);

    // cy.get(".acenter > .btn-primary").as("filter_submit_button");
    // cy.get("@filter_submit_button").click({ force: true });

    // // ASSERT
    // cy.get("a.subcell").as("result_row");
    // cy.get("@result_row").should(
    //   "contain",
    //   `${client.firstname} ${client.lastName}`
    // );
  });

  it("created client should be found through the search bar", () => {
    // ARRANGE
    cy.visit("/");

    // ACT
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search");
    cy.get("@global_search").type(`${client.firstname} ${client.lastName}`);

    // ASSERT
    cy.get(".fast-search-popover").as("result_dropdown");
    cy.get("@result_dropdown").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );
  });

  it("created client should have his own client overview", () => {
    // ARRANGE
    cy.visit("/");

    // ACT
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search");
    cy.get("@global_search").type(`${client.firstname} ${client.lastName}`);
    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_link"
    );
    cy.get("@client_link").click({ force: true });

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
