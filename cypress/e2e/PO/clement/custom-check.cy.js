import { generateProspectData, generateOpportunityData } from "./_data";

describe("clement : custom check", () => {
  // SHARED DATA BETWEEN TESTS
  // you may set those data if you want to skip some tests
  let prospectID;
  let opportunityID;

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("create a prospect", () => {
    // BEFORE
    const prospectRandomData = generateProspectData();
    cy.deleteAllProspects();

    // CREATE PROSPECT
    cy.log("Create prospect");

    cy.intercept("GET", "/rest/third/prospect/init/*").as(
      "get_prospect_infos_request"
    );

    cy.createProspect({
      ...prospectRandomData,
      submitTextBtn: "Enregistrer et créer une opportunité",
    });

    cy.wait("@get_prospect_infos_request", { timeout: 200000 });

    cy.get(".mt-0 > .flex-level").as("overview_header");
    cy.get("@overview_header").should("contain", prospectRandomData.corpName);
    cy.get("@overview_header").should("contain", "Prospect");

    // ARRANGE FOR FOLLOWING TESTS
    cy.url().then(($url) => {
      prospectID = $url.split("prospect/")[1].split("?createOpportunity")[0];
      cy.log(`set PropsectID for following test :${prospectID}`);
    });
  });

  it("create opportunity, linked to previously created prospect", () => {
    // BEFORE
    const opportunityRandomData = generateOpportunityData();
    cy.deleteAllOpportunities();

    cy.log("Create opportunity");

    cy.log("Shared data needed for this test :");
    cy.log(`prospectID : ${prospectID}`);

    cy.intercept("POST", "/rest/prospection/opportunities").as(
      "post_create_opportunity_request"
    );
    cy.intercept("POST", "/listing/lightened-opportunities").as(
      "get_opportunity_listing"
    );

    cy.visit(
      `https://app.slsy.io/thirds/prospect/${prospectID}?createOpportunity=`
    );

    cy.get(".popup-panel").as("create_opportunity_panel");
    cy.get("@create_opportunity_panel").should(
      "contain",
      "Créer une opportunité"
    );

    cy.getByDataBot("opportunity-name-input").as("opp_name_input");
    cy.get("@opp_name_input").clear().type(opportunityRandomData.name);

    cy.getByDataBot("opportunity-potential-amount-input").as(
      "opp_potential-amount_input"
    );
    cy.get("@opp_potential-amount_input")
      .clear()
      .type(opportunityRandomData.potentialAmount);

    cy.getByDataBot("opportunity-probability-input").as(
      "opp_probability_input"
    );
    cy.get("@opp_probability_input")
      .clear()
      .type(opportunityRandomData.probability);

    // cy.get("[data-bot=opportunity-note-textarea] > [contenteditable=true]").as(
    //   "opp_note_textarea"
    // );
    // cy.get("@opp_note_textarea").clear().type(opportunityRandomData.note);

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
    cy.get("@opp_listing_table").should("contain", opportunityRandomData.name);

    // ARRANGE FOR FOLLOWING TESTS
    cy.url().then(($url) => {
      prospectID = $url.split("prospect/")[1].split("?createOpportunity")[0];
      cy.log(`set PropsectID for following test :${prospectID}`);
    });

    cy.url().then(($url) => {
      cy.log(`${$url}`);

      cy.wait(4000000);

      // opportunityID = $url.split("opportunities/")[1].split("?contextId")[0];
      // cy.log(`set PropsectID for following test :${opportunityID}`);
    });
  });

  it("Does something else", () => {
    cy.log("Does something else");

    cy.log("Shared data needed for this test :");
    cy.log(`opportunityID : ${opportunityID}`);

    cy.visit(`https://app.slsy.io/prospection/opportunities/${opportunityID}`);

    cy.wait(2000000);
  });
});
