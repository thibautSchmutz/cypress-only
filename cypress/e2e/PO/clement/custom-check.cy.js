import {
  generateProspectData,
  generateOpportunityData,
  generateDocumentData,
} from "./_data";

describe("clement : custom check", () => {
  // SHARED DATA BETWEEN TESTS
  let prospectRandomData;
  let prospectID;

  let opportunityID;
  let opportunityRandomData;

  let documentRandomData;

  let devisID;

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

    // TODO : Uncomment when Vincent HF passes !
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
    cy.get("@prospect_opportunity_btn").click({ force: true });

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

  it("opportunity steps should be editable", () => {
    const opportunitySteps = [
      "Piste",
      "Prospection",
      "Contact téléphonique",
      "Envoi de devis",
      "Négociation",
      "Devis signé",
      "Affaire conclue",
    ];
    const selectedStepIndex = 2;

    // MANUALLY ARRANGE DATA IF NEEDED
    // opportunityID = 40;
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
    cy.get("@opportunity_more_info_btn").click({ force: true });

    cy.wait("@get_opportunity_overview_req");

    cy.get("[mappingname='Opportunity'] header").as(
      "opportunity_overview_header"
    );

    cy.wrap("@opportunity_overview_header")
      .get(".el-step")
      .as("opportunity_steps");
    cy.log("@opportunity_steps");

    cy.intercept(
      "PUT",
      "/rest/prospection/opportunities/*/step?_output=overview"
    ).as("opportunity_update_step_req");

    cy.get("@opportunity_steps").eq(selectedStepIndex).click({ force: true });

    cy.wait("@opportunity_update_step_req");

    cy.get(".data-block .data-value").as("opportunity_overview_infos");
    cy.get("@opportunity_overview_infos").should(
      "contain",
      opportunitySteps[selectedStepIndex]
    );

    cy.get("@opportunity_steps")
      .eq(selectedStepIndex + 2)
      .click({ force: true });

    cy.wait("@opportunity_update_step_req");

    cy.get(".data-block .data-value").as("opportunity_overview_infos");
    cy.get("@opportunity_overview_infos").should(
      "contain",
      opportunitySteps[selectedStepIndex + 2]
    );

    // #toast-container => .toast-message contains "L'étape de l'opportunité a été mises à jour"
  });

  it("should create a document", () => {
    // MANUALLY ARRANGE DATA IF NEEDED
    // opportunityID = 64;
    cy.log(`TEST DATA : opportunityID : ${opportunityID}`);

    // BEFORE
    documentRandomData = generateDocumentData();

    // TEST START
    cy.intercept("GET", "/rest/opportunity/init/*").as(
      "get_opportunity_overview_req"
    );

    cy.visit(`/prospection/opportunities/${opportunityID}`);

    cy.wait("@get_opportunity_overview_req", { timeout: 200000 });

    /* OPEN CREATE DOCUMENT MODAL */
    cy.intercept("GET", "/rest/prospection/opportunities/*/documents").as(
      "get_opportunity_create_document_req"
    );

    cy.getByDataBot("opp-overview__menu--doc-linked").as(
      "opportunity_create_document_btn"
    );
    cy.get("@opportunity_create_document_btn").click({ force: true });

    cy.wait("@get_opportunity_create_document_req");

    cy.intercept("POST", "/?_f=third").as("create_document_modal_appears_req");

    cy.get("a").contains("Créer un document").as("create_document_btn");
    cy.get("@create_document_btn").click({ force: true });

    cy.wait("@create_document_modal_appears_req");

    cy.intercept("POST", "/?_f=third&action=newDocRecord*").as(
      "create_document_req"
    );

    cy.get("div[role=dialog] button")
      .contains("Créer le document")
      .as("modal_create_document_btn");
    cy.get("@modal_create_document_btn").click({ force: true });

    cy.wait("@create_document_req");

    /* ADD A NEW RAW TO THE DOCUMENT AND INSERT AN AMOUT*/
    cy.intercept("POST", "/?_f=doc").as("add_new_raw_req");

    cy.get("a").contains("Nouvelle ligne").as("add_new_raw_btn");
    cy.get("@add_new_raw_btn").click({ force: true });

    cy.wait("@add_new_raw_req");

    cy.get("#row_unitAmountDisplay_1").as("document_unit_amount_input");
    cy.get("@document_unit_amount_input")
      .clear()
      .type(documentRandomData.unitAmount);

    /* ADD PRODUCT FROM CATALOG */
    cy.intercept("POST", "/?_f=catalogue").as("product_catalog_modal_renders");

    cy.get("a")
      .contains("Accéder au catalogue")
      .as("access_product_catalog_btn");
    cy.get("@access_product_catalog_btn").click({ force: true });

    cy.wait("@product_catalog_modal_renders");

    /* CHECK THAT NO PRODUCTS ARE IN THE PRODUCT'S CART */
    cy.get("#cart").as("selected_product_left_panel");
    cy.get("@selected_product_left_panel").should(
      "contain",
      "Ajouter des produits à la sélection"
    );

    cy.get("#docCatalogueFormContent tbody tr")
      .eq(0)
      .as("first_product_in_catalog");

    cy.get("@first_product_in_catalog")
      .find(".addItemtoCart")
      .click({ force: true });

    cy.get("@first_product_in_catalog")
      .find(".row_item_name")
      .invoke("text")
      .then((productNameInnerText) => {
        /* CHECK THAT SELECTED PRODUCT IS IN THE PRODUCT'S CART */
        cy.get("@selected_product_left_panel").should(
          "contain",
          productNameInnerText
        );

        cy.intercept("POST", "/?_f=catalogue*").as(
          "submit_add_product_to_document_req"
        );

        cy.get("button")
          .contains("Valider")
          .as("submit_add_product_to_document_btn");
        cy.get("@submit_add_product_to_document_btn").click({ force: true });

        cy.wait("@submit_add_product_to_document_req");

        /* CHECK THAT SELECTED PRODUCT IS IN THE DOCUMENT */
        cy.get(`input[value="${productNameInnerText}"]`).should("be.visible");

        /* CHECK ADD SIGNATURES IN PDF OPTION */
        cy.get("#showSignAndStamp").as("add_signature_to_pdf_checkbox");
        cy.get("@add_signature_to_pdf_checkbox").check();

        /* UPDATE DOCUMENT PREFERENCES */
        cy.get("#docSettingsPanelBtn").as("update_document_preferences_btn");
        cy.get("@update_document_preferences_btn").click({ force: true });

        cy.get("#content_paymediums label")
          .contains("virement bancaire")
          .click({ force: true });
        cy.get("#content_paymediums label")
          .contains("carte bancaire")
          .click({ force: true });

        /* SUBMIT DOCUMENT */
        cy.intercept("GET", "/rest/documents/estimate/*/kpi").as(
          "devis_page_loaded"
        );

        cy.getByDataBot("docform-sale--save-and-exit").click({ force: true });

        cy.wait("@devis_page_loaded", { timeout: 200000 });

        /* CONVERT TO BILL */
        cy.get("a")
          .contains(/^Facture$/)
          .as("convert_to_bill_btn");
        cy.get("@convert_to_bill_btn").click({ force: true });

        cy.intercept("POST", "/?_f=third").as("convert_to_bill_submit_req");

        cy.get("button")
          .contains(/^Convertir$/)
          .as("modal_confirm_convert_to_bill_btn");
        cy.get("@modal_confirm_convert_to_bill_btn").click({ force: true });

        cy.wait("@convert_to_bill_submit_req", { timeout: 200000 });

        /* TRANSFORM PROSPECT */

        cy.intercept("POST", "/?_f=doc").as("transform_prospect_req");

        cy.get("button")
          .contains(/^Enregistrer$/)
          .as("modal_confirm_transform_prospect_btn");
        cy.get("@modal_confirm_transform_prospect_btn").click({ force: true });

        cy.wait("@transform_prospect_req", { timeout: 200000 });

        // cy.url().then(($url) => {
        //   // devisID
        //   opportunityID = $url.split("opportunities/")[1].split("?contextId")[0];
        //   cy.log(`set opportunityID for following test :${opportunityID}`);
        // });
        // TODO : Delete all documents
        // .overview-leftpane-container
      });
  });
});
