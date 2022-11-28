import createClementCustomData from "./_data";

describe("clement : custom check", () => {
  let data;

  before(() => {
    data = createClementCustomData();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllProspects();
  });

  it("create a prospect with opportunity", () => {
    // CREATE PROSPECT
    cy.log("Create prospect");

    cy.intercept("GET", "/rest/third/prospect/init/*").as(
      "get_prospect_infos_request"
    );

    cy.createProspect({
      ...data.prospect,
      submitTextBtn: "Enregistrer et créer une opportunité",
    });

    cy.wait("@get_prospect_infos_request", { timeout: 200000 });

    cy.get(".mt-0 > .flex-level").as("overview_header");
    cy.get("@overview_header").should("contain", data.prospect.corpName);
    cy.get("@overview_header").should("contain", "Prospect");

    // CREATE OPPORTUNITY
    cy.log("Create opportunity");

    cy.intercept("POST", "/rest/prospection/opportunities").as(
      "post_create_opportunity_request"
    );
    cy.intercept("POST", "/listing/lightened-opportunities").as(
      "get_opportunity_listing"
    );

    cy.get(".popup-panel").as("create_opportunity_panel");
    cy.get("@create_opportunity_panel").should(
      "contain",
      "Créer une opportunité"
    );

    cy.getByDataBot("opportunity-name-input").as("opp_name_input");
    cy.get("@opp_name_input").clear().type(data.opportunity.name);

    cy.getByDataBot("opportunity-potential-amount-input").as(
      "opp_potential-amount_input"
    );
    cy.get("@opp_potential-amount_input")
      .clear()
      .type(data.opportunity.potentialAmount);

    cy.getByDataBot("opportunity-probability-input").as(
      "opp_probability_input"
    );
    cy.get("@opp_probability_input").clear().type(data.opportunity.probability);

    cy.get("[data-bot=opportunity-note-textarea] > [contenteditable=true]").as(
      "opp_note_textarea"
    );
    cy.get("@opp_note_textarea").clear().type(data.opportunity.note);

    cy.get(".sidepanel-medium .slsy-button")
      .contains("Enregistrer")
      .as("opp_submit_btn");
    cy.get("@opp_submit_btn").click({ force: true });

    cy.wait("@post_create_opportunity_request", { timeout: 200000 });

    cy.get(".sidemenu-overview a")
      .contains("Opportunités")
      .as("side_menu_opportunity_btn");
    cy.get("@side_menu_opportunity_btn").click({ force: true });

    cy.wait("@get_opportunity_listing", { timeout: 200000 });

    cy.get(".listing").as("opp_listing_table");
    cy.get("@opp_listing_table").should("contain", data.opportunity.name);

    // GET OPPORTUNITY INFOS
    // TODO : Command clear all opportunities

    cy.get(".el-table__row").contains(data.opportunity.name).as("created_opp");

    cy.get("@created_opp").click({ force: true });
  });
});
