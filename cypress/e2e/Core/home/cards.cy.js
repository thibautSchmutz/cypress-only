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

  it("should be able to add a card from dashboard dropdown", () => {
    // ARRANGE
    const cardValue = "agenda";
    const cardTitle = "Mon agenda";
    cy.intercept("GET", `/home/card/${cardValue}`).as("add_card_request");

    // ACT
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

    // ASSERT
    cy.get("[data-bot=dashboard__card--is-customizable]").as("updated_cards");
    cy.get("@updated_cards").should("contain", cardTitle);
  });

  it("should be able to remove a card from dashboard dropdown", () => {
    cy.get(".el-button").as("handle_dashboard");
    cy.get("@handle_dashboard").click({ force: true });

    cy.get(".el-checkbox.is-checked").as("checked_options");

    cy.get("@checked_options").then((uncheckedOptions) => {
      // TODO : get first checked label (attention, il en faut plus d'une !)
      // TODO : click on option
      // TODO : assert the correct card has been added
      // cy.log("unchecked options");
      // cy.log(uncheckedOptions);
    });

    // cy.get("@checked_options").then((checkedOptions) => {
    //   for (let index = 0; index < cb.length; index++) {
    //     if (cb[index].contains("is-checked")) {
    //       cy.log(cb[index]);
    //     }
    //   }
    // });

    // cy.get("@unchecked_options").first().click({ force: true });

    // cy.get("@options_non_cochées").then(($checkboxes) => {
    //   let text = $checkboxes.first().get(".el-checkbox__label");
    // });
  });
});
