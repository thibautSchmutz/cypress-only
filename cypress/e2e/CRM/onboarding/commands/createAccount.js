module.export = Cypress.Commands.add(
  "createAccount",
  ({ companyName, firstName, lastName, email, phone, password }) => {
    // ARRANGE
    cy.intercept("GET", "/onboarding/quicktrial").as("onboarding_init");
    cy.intercept("GET", "/home/init").as("saas_init");

    cy.log("ACTION : create account");

    cy.visit("/onboarding/quicktrial");

    cy.wait("@onboarding_init");

    cy.get("label[for='name'] + .el-form-item__content input").as(
      "company_input"
    );
    cy.get("@company_input").type(companyName);

    cy.get("label[for='lastname'] + .el-form-item__content input").as(
      "lastname_input"
    );
    cy.get("@lastname_input").type(lastName);

    cy.get("label[for='firstname'] + .el-form-item__content input").as(
      "firstname_input"
    );
    cy.get("@firstname_input").type(firstName);

    cy.get("label[for='job'] + .el-form-item__content .el-select").as(
      "job_input"
    );
    cy.get("@job_input").click();
    cy.get(".el-select-dropdown .el-select-dropdown__item").first().click();

    cy.get("label[for='phone_number'] + .el-form-item__content input").as(
      "phone_input"
    );
    cy.get("@phone_input").type(phone);

    cy.get("label[for='login'] + .el-form-item__content input").as(
      "email_input"
    );
    cy.get("@email_input").type(email);

    cy.get("label[for='password'] + .el-form-item__content input").as(
      "password_input"
    );
    cy.get("@password_input").type(password);

    cy.get(".slsy-button").contains("Créer mon compte").as("submit_btn");
    cy.get("@submit_btn").click();

    cy.wait("@saas_init", { timeout: 200000 });

    cy.log("Account created");
  }
);
