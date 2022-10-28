module.export = Cypress.Commands.add(
  "createClient",
  ({
    firstname,
    lastName,
    position,
    email,
    phone,
    mobile,
    social: { twitter, facebook, linkedin, viadeo },
    note,
  }) => {
    // ARRANGE
    cy.intercept("GET", "/home/init").as("saas_init");
    cy.intercept("POST", "/?_f=third").as("create_client_modal_renders");
    cy.intercept("GET", "/rest/third/client/init/*").as("get_client_infos");

    cy.log("ACTION : create client");

    cy.visit("/");

    cy.wait("@saas_init");

    cy.getByDataBot("menu__contact--client-add").as("open_create_client_btn");
    cy.get("@open_create_client_btn").click({ force: true });

    cy.wait("@create_client_modal_renders");

    cy.get("#isPerson").as("individual_checkbox");
    cy.get("@individual_checkbox").click({ force: true });

    cy.get("#thirdcontact_forename").as("firstname_input");
    cy.get("@firstname_input").type(firstname);

    cy.get("#thirdcontact_name").as("lastname_input");
    cy.get("@lastname_input").type(lastName);

    cy.get("#thirdcontact_position").as("job_input");
    cy.get("@job_input").type(position);

    cy.get("#thirdcontact_email").as("email_input");
    cy.get("@email_input").type(email);

    cy.get("#thirdcontact_tel").as("phone_input");
    cy.get("@phone_input").type(phone);

    cy.get("#thirdcontact_mobile").as("mobile_input");
    cy.get("@mobile_input").type(mobile);

    cy.get("#corp_twitter").as("twitter_input");
    cy.get("@twitter_input").type(twitter);

    cy.get("#corp_facebook").as("facebook_input");
    cy.get("@facebook_input").type(facebook);

    cy.get("#corp_linkedin").as("linkedin_input");
    cy.get("@linkedin_input").type(linkedin);

    cy.get("#corp_viadeo").as("viadeo_input");
    cy.get("@viadeo_input").type(viadeo);

    cy.get(".redactor_redactor").as("note_textarea");
    cy.get("@note_textarea").type(note);

    cy.get(".ui-dialog-buttonset > .btn-primary").as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@get_client_infos");
  }
);
