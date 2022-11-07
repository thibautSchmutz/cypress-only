module.exports = Cypress.Commands.add("clearAllCards", () => {
  cy.get("[data-bot=dashboard__card--is-customizable]").as("cards");

  cy.visit("/");

  cy.findByText("Gérer le tableau de bord").as("handle_cards_btn");
  cy.get("@handle_cards_btn").click({ force: true });

  cy.get(".el-checkbox__input.is-checked").as("checked_options");

  cy.get("@checked_options").then((checkedOptions) => {
    if (checkedOptions.length !== 0) {
      // starts with index = 1 : to leave only first card active.
      for (let index = 1; index < checkedOptions.length; index++) {
        cy.wrap(checkedOptions[index])
          .find(".el-checkbox__original")
          .click({ force: true });
      }
    }
  });
});
