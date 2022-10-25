// DO NOT PRINT RESIZE ERRORS
Cypress.on("uncaught:exception", (err) => {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

// OVERWRITES
Cypress.Commands.overwrite(
  "type",
  (originalFn, subject, text, options = {}) => {
    options.delay = 0;
    return originalFn(subject, text, options);
  }
);

// EXTENDS
Cypress.Commands.add("getByDataBot", (dataBotName, ...args) => {
  return cy.get(`[data-bot=${dataBotName}]`, ...args);
});

// CUSTOM COMMANDS
Cypress.Commands.add("login", (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit(Cypress.env("LOGIN_URL"));
      cy.get("#email").clear().type(email);
      cy.get("#password").clear().type(password);
      cy.get("#submit").click();
      cy.url().should(($url) => {
        expect($url).to.contain("/home");
      });
    },
    {
      validate() {
        cy.visit("/home");
      },
    }
  );
});
