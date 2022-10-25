import createRandomClient from "./_data";

describe("client : create", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  const individual = createRandomClient();

  it("should create a client", () => {
    cy.visit("/");

    cy.getByDataBot("menu__contact--client-add").click({ force: true });
    cy.get("#isPerson").click();
    cy.get("#thirdcontact_forename").type(individual.firstname);
    cy.get("#thirdcontact_name").type(individual.lastName);
    cy.get("#thirdcontact_position").type(individual.position);
    cy.get("#thirdcontact_email").type(individual.email);
    cy.get("#thirdcontact_tel").type(individual.phone);
    cy.get("#corp_twitter").type(individual.social.twitter);
    cy.get("#corp_facebook").type(individual.social.facebook);
    cy.get("#corp_linkedin").type(individual.social.linkedin);
    cy.get("#corp_viadeo").type(individual.social.viadeo);
    cy.get(".redactor_redactor").type(individual.note);
    cy.get(".ui-dialog-buttonset > .btn-primary").click({ force: true });

    cy.intercept("GET", "/rest/third/client/init/*").as("getClientInfos");
    cy.wait("@getClientInfos");
  });

  it("created client should be found in the client listing", () => {
    // ARRANGE
    cy.visit("/directory/clients");

    cy.get(".leftpane").as("filter_panel");
    cy.get("@filter_panel").then(($panel) => {
      if ($panel.find(":contains('Réinitialiser')")) {
        cy.get(".graylist > .flex-level > .close-btn").as("clear_filters_btn");
        cy.get("@clear_filters_btn").click({ force: true });
      }
    });

    // ACT
    cy.get(".filterList").contains("Nom").click({ force: true });

    cy.get(".form-input > .wp-10").as("filter_input_name");
    cy.get("@filter_input_name").type(individual.lastName);

    cy.get(".acenter > .btn-primary").as("filter_submit_button");
    cy.get("@filter_submit_button").click({ force: true });

    // ASSERT
    cy.get("a.subcell").as("result_row");
    cy.get("@result_row").should(
      "contain",
      `${individual.firstname} ${individual.lastName}`
    );
  });

  it("created client should be found through the search bar", () => {
    // ARRANGE
    cy.visit("/");

    // ACT
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search");
    cy.get("@global_search").type(
      `${individual.firstname} ${individual.lastName}`
    );

    // ASSERT
    cy.get(".fast-search-popover").as("result_dropdown");
    cy.get("@result_dropdown").should(
      "contain",
      `${individual.firstname} ${individual.lastName}`
    );
  });

  it("created client should have his own client overview", () => {
    // ARRANGE
    cy.visit("/");

    // ACT
    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search");
    cy.get("@global_search").type(
      `${individual.firstname} ${individual.lastName}`
    );
    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_link"
    );
    cy.get("@client_link").click({ force: true });

    // ASSERT
    cy.get(".overview-root > header").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${individual.firstname} ${individual.lastName}`
    );

    cy.getByDataBot("client-overview__menu--general-info").click({
      force: true,
    });

    cy.get("#contentDiv").as("overview_content");
    cy.get("@overview_content").should(
      "contain",
      `${individual.firstname} ${individual.lastName}`
    );
    cy.get("@overview_content").should("contain", individual.email);
    cy.get("@overview_content").should("contain", individual.social.facebook);
    cy.get("@overview_content").should("contain", individual.social.linkedin);
    cy.get("@overview_content").should("contain", individual.social.viadeo);
    cy.get("@overview_content").should("contain", individual.note);
  });
});
