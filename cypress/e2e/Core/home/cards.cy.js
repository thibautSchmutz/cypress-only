// import data from './_data';

describe("Home", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/home");
    cy.clearAllCards();
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
    cy.get(".el-button").as("handle_dashboard");
    cy.get("@handle_dashboard").click({ force: true });

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
