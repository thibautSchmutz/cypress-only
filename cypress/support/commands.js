// DO NOT PRINT RESIZE ERRORS
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

// Login
Cypress.Commands.add("login", (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit("https://login.slsy.io/login");
      cy.get("#email").clear().type(email);
      cy.get("#password").clear().type(password);
      cy.get("#submit").click();
      cy.url().should("contain", "/home");
    },
    {
      validate() {
        cy.visit("https://app.slsy.io/home");
      },
    }
  );
});