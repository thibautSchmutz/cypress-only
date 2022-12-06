import { generateProspectData, generateOpportunityData } from "./_data";

describe("clement : custom check", () => {
  // SHARED DATA BETWEEN TESTS
  let prospectRandomData;
  let prospectID;

  let opportunityID;
  let opportunityRandomData;

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should create a prospect", () => {
    // BEFORE
    prospectRandomData = generateProspectData();
    cy.deleteAllProspects();

    // TEST STARTS
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

  it("should create an opportunity", () => {
    // MANUALLY ARRANGE DATA IF NEEDED
    // const prospectID =
    cy.log(`TEST DATA : prospectID : ${prospectID}`);
    // BEFORE
    opportunityRandomData = generateOpportunityData();
    cy.deleteAllOpportunities();

    // TEST STARTS
    cy.log("Create opportunity");

    cy.log("Shared data needed for this test :");
    cy.log(`prospectID : ${prospectID}`);

    cy.intercept("POST", "/rest/prospection/opportunities").as(
      "post_create_opportunity_request"
    );
    cy.intercept("POST", "/listing/lightened-opportunities").as(
      "get_opportunity_listing"
    );

    cy.visit(`/thirds/prospect/${prospectID}?createOpportunity=`);

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
  });

  it("opportunity overview should be bound to previously created prospect", () => {
    // MANUALLY ARRANGE DATA IF NEEDED
    // prospectID = 298;
    // opportunityRandomData = {
    //   name: "vehicula",
    // };
    cy.log(`TEST DATA : prospectID : ${prospectID}`);
    cy.log(
      `TEST DATA : opportunityRandomData.name : ${opportunityRandomData.name}`
    );

    // TEST START
    cy.intercept("POST", "/listing/lightened-opportunities").as(
      "get_opportunities_listing"
    );

    cy.visit(`/thirds/prospect/${prospectID}`);

    cy.getByDataBot("prospect-overview__menu--opportunity").as(
      "prospect_opportunity_btn"
    );
    cy.get("@prospect_opportunity_btn").click();

    cy.wait("@get_opportunities_listing", { timeout: 200000 });

    cy.intercept("GET", "/rest/opportunity/init/*").as(
      "get_opportunity_overview_req"
    );

    cy.get(".listing").as("oppotunity_listing_container");
    cy.wrap("@oppotunity_listing_container")
      .get(".el-table__row")
      .contains(opportunityRandomData.name)
      .click({ force: true });

    cy.wait("@get_opportunity_overview_req", { timeout: 200000 });

    cy.get("[mappingname='Opportunity'] header").as(
      "opportunity_overview_header"
    );
    cy.get("@opportunity_overview_header").should(
      "contain",
      opportunityRandomData.name
    );

    cy.url().then(($url) => {
      opportunityID = $url.split("opportunities/")[1].split("?contextId")[0];
      cy.log(`set opportunityID for following test :${opportunityID}`);
    });
  });

  it.only("opportunity steps should be editable", () => {
    const opportunitySteps = [
      "Piste",
      "Prospection",
      "Contact téléphonique",
      "Envoi de devis",
      "Négociation",
      "Devis signé",
      "Affaire conclue",
    ];

    // MANUALLY ARRANGE DATA IF NEEDED
    opportunityID = 40;
    cy.log(`TEST DATA : opportunityID : ${opportunityID}`);

    // TEST START
    cy.intercept("GET", "/rest/opportunity/init/*").as(
      "get_opportunity_overview_req"
    );

    cy.visit(`/prospection/opportunities/${opportunityID}`);

    cy.wait("@get_opportunity_overview_req", { timeout: 200000 });

    cy.intercept("GET", "/rest/opportunity/init/*").as(
      "get_opportunity_overview_req"
    );

    cy.getByDataBot("opp-overview__menu--general-info").as(
      "opportunity_more_info_btn"
    );
    cy.get("@opportunity_more_info_btn").click();

    cy.wait("@get_opportunity_overview_req");

    cy.get("[mappingname='Opportunity'] header").as(
      "opportunity_overview_header"
    );

    cy.wrap("@opportunity_overview_header")
      .get(".el-step")
      .as("opportunity_steps");
    cy.log("@opportunity_steps");

    // TODO : Click on steps to see if name changes
    // const steps = [''Piste', '...', etc]

    // TODO : Click on Second one, should match second el in array + toast appears

    cy.intercept(
      "PUT",
      "/rest/prospection/opportunities/*/step?_output=overview"
    ).as("opportunity_update_step_req");

    cy.get("@opportunity_steps").eq(2).click();

    cy.wait("@opportunity_update_step_req");

    // #toast-container => .toast-message contains "L'étape de l'opportunité a été mises à jour"
  });
});
