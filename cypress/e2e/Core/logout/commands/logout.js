module.exports = Cypress.Commands.add("logout", () => {
  cy.intercept("POST", "/logout").as("logout_request");

  cy.get("[data-bot=menu-burger] .menu-btn")
    .as("btn-menu")
    .click({ force: true });

  cy.get(".dropdown-right button")
    .contains("Se déconnecter")
    .click({ force: true });

  cy.wait("@logout_request", { timeout: 200000 });

  cy.log("Logged OUT");

  cy.url().should("include", "login");
});
