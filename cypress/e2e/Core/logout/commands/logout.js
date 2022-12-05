module.exports = Cypress.Commands.add("logout", () => {

    cy.intercept("POST", "/logout").as("logout_request");

    cy.get("[data-bot=menu-burger] .menu-btn").as("btn-menu").click();

    cy.get('.dropdown-right button').contains('Se déconnecter').click();

    cy.wait("@logout_request");

    cy.log("Logged OUT");

    cy.url().should('include', 'login');
  });
  