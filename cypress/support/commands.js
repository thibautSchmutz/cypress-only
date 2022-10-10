// DO NOT PRINT RESIZE ERRORS
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

// Login
Cypress.Commands.add("login", () => {
  cy.visit("https://login.slsy.io/login");

  cy.get("#email").clear().type("admin@sellsy.com");
  cy.get("#password").clear().type("admin");
  cy.get("#submit").click();
});
