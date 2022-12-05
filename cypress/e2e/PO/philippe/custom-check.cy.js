import createPhilippeCustomData from "./_data";

describe("Philippe : custom check", () => {
  let data;

  before(() => {
    // cy.intercept("POST", "/web-token").as("login_request");
    data = createPhilippeCustomData();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.logout();
  });

  it("should create a new account and login with account", () => {
    cy.createAccount(data.account);

    cy.get("#contentDiv .contentMargin h1").as("welcome_title");
    cy.get("@welcome_title").should("contain", data.account.firstName);

    cy.logout();

    // To get around account creation bug
    cy.visit(Cypress.env("LOGIN_URL"));
    cy.get("#email").as("email_input");
    cy.get("@email_input").clear().type(data.account.email);

    cy.get("#password").as("password_input");
    cy.get("@password_input").clear().type(data.account.password);

    cy.get("#submit").as("log_in_submit_button");
    cy.get("@log_in_submit_button").click();
  });

  it("should create a prospect", () => {
    cy.intercept("GET", "/rest/third/prospect/init/*").as("get_prospect_infos");

    cy.login(data.account.email, data.account.password);

    // ACT
    cy.createProspect({ ...data.prospect, submitTextBtn: "Enregistrer" });

    cy.wait("@get_prospect_infos");
  });

  // Création nouveau compte via onboarding => https://app.slsy.io/onboarding/quicktrial

  // Création nouveau prospect + contact principal
  // Enregistrer
  // Tu arrives sur l'overview => création d'adresse => création d'un nouveau contact
  // Onglet Activité => ajout commentaire / tache / event / appel
  // Onglet Opportunité => Création d'un opp
  // Overview d'opp => test de la mise à jour du statut & des étapes (via le header)
  // Depuis l'opp => création d'un devis
  // Overview devis => convertir en facture
  // Overview facture => ajout paiement => facture passe en payée
});
