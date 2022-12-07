describe("Home", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/home");

    // reset Cards
    cy.log("ACTION: reset dashboard cards");

    cy.get("[data-bot=dashboard__card--is-customizable]").as("cards");

    cy.visit("/");

    cy.get("button")
      .contains("Gérer le tableau de bord")
      .as("handle_dashboard_cards_btn");
    cy.get("@handle_dashboard_cards_btn").click({ force: true });

    cy.get(".el-checkbox__input.is-checked").as("checked_options");

    cy.get("@checked_options").then((checkedOptions) => {
      if (!!checkedOptions.length) {
        // starts with index = 1 : to leave only first card active.
        for (let index = 1; index < checkedOptions.length; index++) {
          cy.wrap(checkedOptions[index])
            .find(".el-checkbox__original")
            .click({ force: true });
        }
      }
    });
    cy.log("Dashboard cards reseted");
  });

  it("should have at least one card", () => {
    // ARRANGE
    cy.get("[data-bot=dashboard__card--is-customizable]").as("cards");

    // ASSERT
    cy.get("@cards").its("length").should("be.gte", 1);
  });

  it("should be able to add and remove a card from dashboard dropdown", () => {
    // ARRANGE
    const cardValue = "agenda";
    const cardTitle = "Mon agenda";
    cy.intercept("GET", `/home/card/${cardValue}`).as("add_card_request");
    cy.intercept("POST", "/home/save").as("remove_card_request");

    // ACT : Add a card
    cy.getByDataBot("dashboard-manage").as("dashboard-manage_btn");
    cy.get("@dashboard-manage_btn").click({ force: true });

    cy.get(".el-checkbox").not(".is-checked").as("unchecked_options");
    cy.get("@unchecked_options").then((uncheckedOptions) => {
      if (uncheckedOptions.length !== 0) {
        cy.wrap(uncheckedOptions.find(`input[value="${cardValue}"]`)).as(
          "agenda_checkbox"
        );
        cy.get("@agenda_checkbox").click({ force: true });

        cy.wait("@add_card_request");
      }
    });

    // ASSERT : Add a card
    cy.getByDataBot("dashboard__card--is-customizable").should(
      "contain",
      cardTitle
    );

    // ACT : Remove a card
    cy.get(".el-checkbox.is-checked").as("checked_options");
    cy.get("@checked_options").then((checkedOptions) => {
      if (checkedOptions.length !== 0) {
        cy.wrap(checkedOptions.find(`input[value="${cardValue}"]`)).as(
          "agenda_checkbox"
        );
        cy.get("@agenda_checkbox").click({ force: true });

        cy.wait("@remove_card_request");
      }
    });

    // ASSERT : Remove a card
    cy.getByDataBot("dashboard__card--is-customizable").should(
      "not.contain",
      cardTitle
    );
  });
});
