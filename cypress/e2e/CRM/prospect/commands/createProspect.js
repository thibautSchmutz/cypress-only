module.exports = Cypress.Commands.add(
  "createProspect",
  ({
    corpName,
    corpReference,
    corpWebsite,
    corpPriceCategory,
    corpPhone,
    corpMobile,
    corpEmail,

    contactFirstName,
    contactLastName,
    contactJob,
    contactEmail,
    contactPhone,
    contactMobile,

    corpLegalStatus,
    corpSIRET,
    corpSIREN,
    corpAPE,
    corpCapitalStock,
    corpRCS,
    corpTVAintra,

    corpTwitter,
    corpFacebook,
    corpLinkedin,

    corpNote,

    submitTextBtn,
  }) => {
    cy.intercept("GET", "/home/init").as("saas_init");
    cy.intercept("POST", "/?_f=third").as("create_prospect_modal_renders");
    cy.intercept("GET", "/rest/third/prospect/init/*").as("get_prospect_infos");

    cy.log("ACTION : create prospect");

    cy.visit("/");

    cy.wait("@saas_init");

    cy.getByDataBot("menu__contact--prospect-add").as(
      "open_create_prospect_btn"
    );
    cy.get("@open_create_prospect_btn").click({ force: true });

    cy.wait("@create_prospect_modal_renders");

    cy.get("#corp_name").as("corp_name_input");
    cy.get("@corp_name_input").type(corpName, { force: true });

    cy.get("#corp_ident").as("corp_ref_input");
    cy.get("@corp_ref_input").type(corpReference, { force: true });

    cy.get("#corp_web").as("corp_website_input");
    cy.get("@corp_website_input").type(corpWebsite, { force: true });

    cy.get("[name=corp_rateCategory]").as("corp_price-category_select");
    cy.get("@corp_price-category_select").select(corpPriceCategory, {
      force: true,
    });

    cy.get("#corp_tel").as("corp_phone_input");
    cy.get("@corp_phone_input").type(corpPhone, { force: true });

    cy.get("#corp_mobile").as("corp_mobile_input");
    cy.get("@corp_mobile_input").type(corpMobile, { force: true });

    cy.get("#corp_email").as("corp_email_input");
    cy.get("@corp_email_input").type(corpEmail, { force: true });

    cy.get("#thirdcontact_forename").as("contact_firstname_input");
    cy.get("@contact_firstname_input").type(contactFirstName, { force: true });

    cy.get("#thirdcontact_name").as("contact_lastname_input");
    cy.get("@contact_lastname_input").type(contactLastName, { force: true });

    cy.get("#thirdcontact_position").as("contact_job_input");
    cy.get("@contact_job_input").type(contactJob, { force: true });

    cy.get("#thirdcontact_email").as("contact_email_input");
    cy.get("@contact_email_input").type(contactEmail, { force: true });

    cy.get("#thirdcontact_tel").as("contact_phone_input");
    cy.get("@contact_phone_input").type(contactPhone, { force: true });

    cy.get("#thirdcontact_mobile").as("contact_mobile_input");
    cy.get("@contact_mobile_input").type(contactMobile, { force: true });

    cy.get("#corp_type").as("corp_legal-status_input");
    cy.get("@corp_legal-status_input").type(corpLegalStatus, { force: true });

    cy.get("#corp_siret").as("corp_siret_input");
    cy.get("@corp_siret_input").type(corpSIRET, { force: true });

    cy.get("#corp_siren").as("corp_siren_input");
    cy.get("@corp_siren_input").type(corpSIREN, { force: true });

    cy.get("#corp_apenaf").as("corp_ape_input");
    cy.get("@corp_ape_input").type(corpAPE, { force: true });

    cy.get("#corp_capital").as("corp_capital_input");
    cy.get("@corp_capital_input").type(corpCapitalStock, { force: true });

    cy.get("#corp_rcs").as("corp_rcs_input");
    cy.get("@corp_rcs_input").type(corpRCS, { force: true });

    cy.get("#corp_vat").as("corp_tva_intra_input");
    cy.get("@corp_tva_intra_input").type(corpTVAintra, { force: true });

    cy.get("#corp_twitter").as("corp_twitter_input");
    cy.get("@corp_twitter_input").type(corpTwitter, { force: true });

    cy.get("#corp_facebook").as("corp_facebook_input");
    cy.get("@corp_facebook_input").type(corpFacebook, { force: true });

    cy.get("#corp_linkedin").as("corp_linkedin_input");
    cy.get("@corp_linkedin_input").type(corpLinkedin, { force: true });

    cy.get(".redactor_redactor").as("prospect_note_textarea");
    cy.get("@prospect_note_textarea").type(corpNote, { force: true });

    cy.intercept("POST", "/?_f=third").as("create_prospect_post_request");
    cy.get(".ui-dialog-buttonset > button")
      .contains(new RegExp(`^${submitTextBtn}$`))
      .as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@create_prospect_post_request", { timeout: 200000 });

    cy.log("Prospect created");
  }
);
