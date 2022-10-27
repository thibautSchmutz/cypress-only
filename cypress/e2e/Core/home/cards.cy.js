// import data from './_data';

describe("Home", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/home");
    cy.get("[data-bot=dashboard__card--is-customizable]").as("cards");
  });

  it("should have at least one card", () => {
    cy.get("@cards").its("length").should("be.gte", 1);
  });

  it("should be able to add a card from dashboard dropdown", () => {
    cy.get(".el-button").as("handle_dashboard");
    cy.get("@handle_dashboard").click({ force: true });

    cy.get(".el-checkbox__input").not(".is-checked").as("unchecked_options");
    cy.get("@unchecked_options").first().click({ force: true });

    // cy.get("@options_non_cochées").then(($checkboxes) => {
    //   let text = $checkboxes.first().get(".el-checkbox__label");
    // });
  });
});
