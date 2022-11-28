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
    cy.get("@corp_name_input").type(corpName);

    cy.get("#corp_ident").as("corp_ref_input");
    cy.get("@corp_ref_input").type(corpReference);

    cy.get("#corp_web").as("corp_website_input");
    cy.get("@corp_website_input").type(corpWebsite);

    cy.get("[name=corp_rateCategory]").as("corp_price-category_select");
    cy.get("@corp_price-category_select").select(corpPriceCategory);

    cy.get("#corp_tel").as("corp_phone_input");
    cy.get("@corp_phone_input").type(corpPhone);

    cy.get("#corp_mobile").as("corp_mobile_input");
    cy.get("@corp_mobile_input").type(corpMobile);

    cy.get("#corp_email").as("corp_email_input");
    cy.get("@corp_email_input").type(corpEmail);

    cy.get("#thirdcontact_forename").as("contact_firstname_input");
    cy.get("@contact_firstname_input").type(contactFirstName);

    cy.get("#thirdcontact_name").as("contact_lastname_input");
    cy.get("@contact_lastname_input").type(contactLastName);

    cy.get("#thirdcontact_position").as("contact_job_input");
    cy.get("@contact_job_input").type(contactJob);

    cy.get("#thirdcontact_email").as("contact_email_input");
    cy.get("@contact_email_input").type(contactEmail);

    cy.get("#thirdcontact_tel").as("contact_phone_input");
    cy.get("@contact_phone_input").type(contactPhone);

    cy.get("#thirdcontact_mobile").as("contact_mobile_input");
    cy.get("@contact_mobile_input").type(contactMobile);

    cy.get("#corp_type").as("corp_legal-status_input");
    cy.get("@corp_legal-status_input").type(corpLegalStatus);

    cy.get("#corp_siret").as("corp_siret_input");
    cy.get("@corp_siret_input").type(corpSIRET);

    cy.get("#corp_siren").as("corp_siren_input");
    cy.get("@corp_siren_input").type(corpSIREN);

    cy.get("#corp_apenaf").as("corp_ape_input");
    cy.get("@corp_ape_input").type(corpAPE);

    cy.get("#corp_capital").as("corp_capital_input");
    cy.get("@corp_capital_input").type(corpCapitalStock);

    cy.get("#corp_rcs").as("corp_rcs_input");
    cy.get("@corp_rcs_input").type(corpRCS);

    cy.get("#corp_vat").as("corp_tva_intra_input");
    cy.get("@corp_tva_intra_input").type(corpTVAintra);

    cy.get("#corp_twitter").as("corp_twitter_input");
    cy.get("@corp_twitter_input").type(corpTwitter);

    cy.get("#corp_facebook").as("corp_facebook_input");
    cy.get("@corp_facebook_input").type(corpFacebook);

    cy.get("#corp_linkedin").as("corp_linkedin_input");
    cy.get("@corp_linkedin_input").type(corpLinkedin);

    cy.get(".redactor_redactor").as("prospect_note_textarea");
    cy.get("@prospect_note_textarea").type(corpNote);

    cy.intercept("POST", "/?_f=third").as("create_prospect_post_request");

    cy.get(".ui-dialog-buttonset > button")
      .contains(new RegExp(`^${submitTextBtn}$`))
      .as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@create_prospect_post_request");

    cy.log("Prospect created");
  }
);
