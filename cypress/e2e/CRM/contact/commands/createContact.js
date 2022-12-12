module.export = Cypress.Commands.add(
  "createContact",
  ({
    firstname,
    lastName,
    position,
    dateOfBirth,
    email,
    phone,
    mobile,
    social: { twitter, facebook, linkedin },
    note,
  }) => {
    // ARRANGE
    cy.intercept("GET", "/home/init").as("saas_init");
    cy.intercept("GET", "/rest/people/init/*").as("get_contact_infos");

    cy.log("ACTION : create contact");

    cy.visit("/");

    cy.wait("@saas_init", { timeout: 200000 });

    cy.getByDataBot("menu__contact--contact-add").as("open_create_contact_btn");
    cy.get("@open_create_contact_btn").click({ force: true });

    cy.getByDataBot("contact-overview__form--lastname").as("contact_lastname");
    cy.get("@contact_lastname").type(lastName);

    cy.getByDataBot("contact-overview__form--firstname").as(
      "contact_firstname"
    );
    cy.get("@contact_firstname").type(firstname);

    cy.getByDataBot("contact-overview__form--role").as("contact_position");
    cy.get("@contact_position").type(position);

    // TODO : Fix date of Birth
    //   cy.getByDataBot("contact-overview__form--birthdate").as("contact_birthdate")
    //   cy.get("@contact_birthdate").then((birthDateContainer) => {
    //     cy.wrap(birthDateContainer).find('input').type(dateOfBirth)
    //   })

    cy.log(dateOfBirth);

    cy.getByDataBot("contact-overview__form--birthdate").as(
      "contact_birthdate"
    );
    cy.get("@contact_birthdate").type(" ");

    cy.get(".el-date-table").as("contact_datepicker_dropdown");
    cy.get("@contact_datepicker_dropdown").then((datePickerDropdown) => {
      cy.wrap(datePickerDropdown).find(".today").click({ force: true });
    });

    cy.getByDataBot("contact-overview__form--email").as("contact_email");
    cy.get("@contact_email").type(email);

    cy.getByDataBot("contact-overview__form--phone").as("contact_phone");
    cy.get("@contact_phone").then((phoneContainer) => {
      cy.wrap(phoneContainer).find("input").type(phone);
    });

    cy.getByDataBot("contact-overview__form--mobile").as("contact_mobile");
    cy.get("@contact_mobile").then((mobileContainer) => {
      cy.wrap(mobileContainer).find("input").type(mobile);
    });

    cy.getByDataBot("contact-overview__tablist-note").as("contact_note");
    cy.get("@contact_note").then((noteContainer) => {
      cy.wrap(noteContainer).find(".ProseMirror").type(note);
    });

    cy.getByDataBot("contact-overview__tablist-social-networks").as(
      "contact_social_networks"
    );
    cy.get("@contact_social_networks").then((socialNetworksContainer) => {
      cy.wrap(socialNetworksContainer)
        .find("div[role=button]")
        .click({ force: true });
    });

    cy.getByDataBot("contact-overview__tablist-social-networks--facebook").as(
      "contact_facebook"
    );
    cy.get("@contact_facebook").type(facebook);

    cy.getByDataBot("contact-overview__tablist-social-networks--twitter").as(
      "contact_twitter"
    );
    cy.get("@contact_twitter").type(twitter);

    cy.getByDataBot("contact-overview__tablist-social-networks--linkedin").as(
      "contact_linkedin"
    );
    cy.get("@contact_linkedin").type(linkedin);

    cy.getByDataBot("contact-overview__btn-bottom--save").as(
      "contact_submit_btn"
    );
    cy.get("@contact_submit_btn").click({ force: true });

    cy.wait("@get_contact_infos", { timeout: 200000 });

    cy.log("Contact created");
  }
);
