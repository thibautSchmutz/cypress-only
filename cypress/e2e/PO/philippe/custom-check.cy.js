import createPhilippeCustomData from "./_data";
import Rd from "../../../utils/index.js";

describe("Philippe : custom check", () => {
  let data;
  let estimateUrl = "";

  before(() => {
    cy.intercept("POST", "/web-token").as("login_request");
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

  it("should create a prospect and a main contact", () => {
    cy.intercept("GET", "/rest/third/prospect/init/*").as("get_prospect_infos");

    cy.login(data.account.email, data.account.password);

    cy.createProspect({ ...data.prospect, submitTextBtn: "Enregistrer" });

    cy.wait("@get_prospect_infos");
  });

  it("should create an address", () => {
    const address = "50 avenue du ";
    const address2 = "lazaret";
    cy.intercept("GET", "/rest/addresses/third/*").as("get_addresses");

    cy.intercept({
      method: "GET",
      url: "https://api.jawg.io/libraries/jawg-places@latest/**",
    }).as("jawg_init");

    cy.intercept({
      method: "GET",
      url: "https://api.jawg.io/places/v1/autocomplete*",
    }).as("autocomplete_address_request");

    cy.login(data.account.email, data.account.password);

    cy.selectProspect(data.prospect.corpName);

    cy.getByDataBot("prospect-overview__menu--address").click({
      force: true,
    });

    cy.wait("@get_addresses");

    cy.get("a.btn-primary")
      .contains("Ajouter une adresse")
      .click({ force: true });

    cy.intercept("POST", "/rest/addresses/third/*").as("address_request");

    cy.wait("@jawg_init");

    cy.get("#address-input").focus().type(address, { force: true });
    cy.get("#address-input").focus().type(address2, { force: true });

    cy.wait("@autocomplete_address_request", { timeout: 200000 });

    cy.get(".jawg-places-results .jawg-places-result")
      .first()
      .click({ force: true });
    cy.get(".sidepanel-medium .btn-primary")
      .contains("Enregistrer")
      .click({ force: true });

    cy.wait("@address_request");

    cy.get(".overview-root .relative section").first().as("address_container");
    cy.get("@address_container").contains(address, { matchCase: false });
  });

  it("should create a comment", () => {
    cy.intercept("POST", "/v2/comments?embed[]=owner").as("comment_request");
    cy.login(data.account.email, data.account.password);
    const comment = Rd.sentence();

    cy.selectProspect(data.prospect.corpName);

    cy.get(".activity-forms .editor-input .ProseMirror")
      .as("comment_textarea")
      .click({ force: true });
    cy.get("@comment_textarea").type(comment);
    cy.get(".activity-forms .editor-input .btn-primary")
      .as("comment_textarea_submit")
      .click({ force: true });

    cy.wait("@comment_request");

    cy.get(".past-events .cd-timeline-log")
      .first()
      .get(".content p")
      .as("latest_comment");

    cy.get("@latest_comment").should("contain", comment);
  });

  it("should create a phonecall", () => {
    cy.intercept("POST", "/?_f=phonecall_listing").as("phonecall_request");
    cy.login(data.account.email, data.account.password);
    const comment = Rd.sentence();

    cy.selectProspect(data.prospect.corpName);
    cy.getByDataBot("prospect-overview__activity--call-add").click({
      force: true,
    });

    cy.wait("@phonecall_request");

    cy.get(".sidepanel-content .redactor_editor")
      .as("phonecall_note")
      .click({ force: true });

    cy.get("@phonecall_note").type(comment);

    cy.get(".sidepanel-footer .btn-primary")
      .as("phonecall_submit")
      .click({ force: true });

    cy.get(".past-events .cd-timeline-log")
      .first()
      .get(".card-body p.grey")
      .as("latest_activity");

    cy.get("@latest_activity").should("contain", comment);
  });

  it("should create a task", () => {
    cy.intercept("POST", "/?_f=agendaEvent").as("task_request");
    cy.login(data.account.email, data.account.password);
    const title = Rd.word();
    const description = Rd.sentence();

    cy.selectProspect(data.prospect.corpName);
    cy.getByDataBot("prospect-overview__activity--task-add").click({
      force: true,
    });

    cy.wait("@task_request");

    cy.get("#popupWindow input[name='aevent_title']")
      .as("task_title")
      .type(title);
    cy.get("#popupWindow .redactor_editor")
      .as("task_description")
      .click({ force: true });
    cy.get("@task_description").type(description);

    cy.get(".ui-dialog-buttonpane .btn-primary")
      .as("task_submit")
      .click({ force: true });

    cy.get(".incoming-events .cd-timeline-log")
      .first()
      .get(".card-body .link")
      .as("latest_activity_title");
    cy.get(".incoming-events .cd-timeline-log")
      .first()
      .get(".card-body p.grey")
      .as("latest_activity_description");

    cy.get("@latest_activity_title").should("contain", title);
    cy.get("@latest_activity_description").should("contain", description);
  });

  it("should create an event", () => {
    cy.intercept("POST", "/?_f=agenda").as("event_request");
    cy.intercept("POST", "/?_f=agendaEvent").as("event_create_request");
    cy.intercept(
      "POST",
      "/?_f=agenda&action=updateEvents&forCalendar=Y&relatedtype=third&relatedid=*&displayAll=Y"
    ).as("event_create_complete_request");
    cy.intercept("POST", "/timeline").as("timeline_updated");

    cy.login(data.account.email, data.account.password);
    const title = Rd.word();
    const description = Rd.sentence();

    cy.selectProspect(data.prospect.corpName);
    cy.getByDataBot("prospect-overview__activity--event-add").click({
      force: true,
    });

    cy.wait("@event_request");

    cy.get("#third-fullcalendar .fc-week .fc-future")
      .eq(2)
      .click({ force: true });

    cy.wait("@event_create_request");

    cy.get("#popupWindow input[name='aevent_title']")
      .as("task_title")
      .type(title);
    cy.get("#popupWindow .redactor_editor")
      .as("task_description")
      .click({ force: true });
    cy.get("@task_description").type(description);

    cy.get(".ui-dialog-buttonpane .btn-primary")
      .as("task_submit")
      .click({ force: true });

    cy.get(".fc-day-grid-event .fc-title").should("contain", title);

    cy.get("#popupAgenda .el-dialog__headerbtn").click({ force: true });

    // cy.getByDataBot("prospect-overview__activity--event-list").click({
    //   force: true,
    // });

    cy.wait("@timeline_updated");

    cy.get(".incoming-events .cd-timeline-log")
      .first()
      .get(".card-body .link")
      .as("latest_event_title");
    cy.get(".incoming-events .cd-timeline-log")
      .first()
      .get(".card-body p.gray-60")
      .as("latest_event_description");

    cy.get("@latest_event_title").should("contain", title);
    cy.get("@latest_event_description").should("contain", description);
  });

  it("should create an opportunity", () => {
    cy.intercept("POST", "/rest/prospection/opportunities").as(
      "post_create_opportunity_request"
    );
    cy.intercept("POST", "/listing/lightened-opportunities").as(
      "get_opportunity_listing"
    );
    cy.intercept("GET", "/rest/prospection/opportunities/_meta?thirdId=*").as(
      "opportunity_panel"
    );

    cy.login(data.account.email, data.account.password);

    cy.selectProspect(data.prospect.corpName);

    cy.getByDataBot("prospect-overview__menu--opportunity").click({
      force: true,
    });

    cy.wait("@get_opportunity_listing");

    cy.get(".listing-layout header .slsy-button")
      .contains("Créer une opportunité", { matchCase: false })
      .click({ force: true });

    cy.wait("@opportunity_panel");

    cy.get("label[for='name'] + .el-form-item__content input").as(
      "opportunity_name"
    );
    cy.get("@opportunity_name").type(data.opportunity.corpName);

    cy.get("label[for='potentialAmount'] + .el-form-item__content input").as(
      "opportunity_amount"
    );
    cy.get("@opportunity_amount")
      .clear()
      .type(data.opportunity.potentialAmount);

    cy.get(".sidepanel-medium .slsy-button")
      .contains("Enregistrer", { matchCase: false })
      .click({ force: true });

    cy.wait("@post_create_opportunity_request");

    cy.get(".el-table .cell a").should("contain", data.opportunity.corpName);

    cy.get(".el-table .subcell").should(
      "contain",
      `${data.opportunity.potentialAmount},00 €`
    );
  });

  it("should update the opportunity step and status", () => {
    cy.intercept("GET", "/rest/opportunity/init/*").as("opportunity_init");
    cy.intercept("PUT", "/rest/prospection/opportunities/**").as(
      "opportunity_step_updated"
    );

    cy.login(data.account.email, data.account.password);
    cy.selectOpportunity(data.opportunity.corpName);

    cy.wait("@opportunity_init");

    cy.get(".opp-step :nth-child(6) > .el-step__head")
      .as("opportunity_step_signed")
      .click({ force: true });

    cy.wait("@opportunity_step_updated");

    cy.get(".step-select input").should("have.value", "Devis signé");

    cy.log("opportunity step updated");

    cy.get(".listing-select")
      .find(".selectedLabel")
      .as("opportunity_status")
      .click({ force: true });

    cy.get("@opportunity_status")
      .siblings(".itemsSelector")
      .find("li:nth-child(2)")
      .click({
        force: true,
      });

    cy.get("@opportunity_status").should("contain", "Gagnée");
  });

  it("should create a quote from the opportunity", () => {
    cy.intercept("GET", "/rest/opportunity/init/*").as("opportunity_init");
    cy.intercept("GET", "/rest/prospection/opportunities/**").as(
      "documents_init"
    );
    cy.intercept("POST", "/?_f=third").as("new_document_create");
    cy.intercept("POST", "/?_f=third&action=newDocRecord&*").as(
      "new_document_init"
    );
    cy.intercept(
      "GET",
      "/?_f=catalogue&type=&search_type=autocomplete&value=*"
    ).as("catalogue_autocomplete_init");
    cy.intercept("POST", "/?_f=catalogue").as("product_selected");
    cy.intercept("POST", "/?_f=prospection_opportunity").as("document_save");
    cy.intercept(
      "POST",
      "/?_f=prospection_opportunity&action=recordUpdateOppWithDocData"
    ).as("linked_opportunity_update");
    cy.intercept("GET", "/rest/documents/estimate/**").as("estimate_init");

    const subject = Rd.sentence();

    cy.login(data.account.email, data.account.password);
    cy.selectOpportunity(data.opportunity.corpName);

    cy.wait("@opportunity_init");

    cy.getByDataBot("opp-overview__menu--doc-linked").click({ force: true });

    cy.wait("@documents_init");

    cy.get(".overview-root .btn")
      .contains(/Créer un document/i)
      .click({ force: true });

    cy.wait("@new_document_create");

    cy.get(".ui-dialog .ui-dialog-buttonset .btn-primary").click({
      force: true,
    });

    cy.wait("@new_document_init");

    cy.log("type document subject");
    cy.get('label[for="subject"] + .form-input .redactor_editor')
      .click({ force: true })
      .type(subject);

    cy.log("add product from catalogue");
    cy.get("#token-input-docForm_searchItem").focus({ force: true });

    cy.wait("@catalogue_autocomplete_init", { timeout: 200000 });

    cy.get(".token-input-dropdown li:first-child").click({ force: true });

    cy.wait("@product_selected");

    cy.log("submit");

    cy.get(".docFormContent .fixed .btn-primary").click({ force: true });

    cy.wait("@document_save");

    cy.get(".ui-dialog .btn-primary").click({ force: true });

    cy.wait("@linked_opportunity_update", { timeout: 200000 });

    cy.wait("@estimate_init", { timeout: 200000 });

    cy.url().then(($url) => {
      estimateUrl = $url;
      cy.log(`save estimate url for next test :${estimateUrl}`);
    });
  });

  it("should convert the estimate to an invoice and add a payment", () => {
    cy.intercept("POST", "/?_f=third").as("prospect_conversion");
    cy.intercept("POST", "/?_f=doc").as("invoice_ready");
    cy.intercept("POST", "/?_f=doc&action=record").as("invoice_saving");

    cy.login(data.account.email, data.account.password);
    cy.visit(estimateUrl);

    cy.get(".overview-action a")
      .contains("enregistrer un paiement", { matchCase: false })
      .click({ force: true });

    cy.wait("@invoice_ready");

    cy.get(".ui-dialog .btn-primary")
      .contains("Enregistrer")
      .click({ force: true });

    cy.wait("@invoice_ready");

    cy.get(".overview-action a")
      .contains(new RegExp(/^Facture$/m))
      .click({ force: true });

    cy.get(".ui-dialog .btn-primary")
      .contains("Convertir")
      .click({ force: true });

    cy.wait("@prospect_conversion");

    cy.get(".ui-dialog .ui-button")
      .contains("Enregistrer")
      .click({ force: true });

    cy.wait("@invoice_ready", { timeout: 200000 });

    cy.get(".fixed .btn-primary")
      .contains("Finaliser en facture")
      .click({ force: true });

    cy.get(".ui-dialog .ui-button")
      .contains("Finaliser")
      .click({ force: true });

    cy.wait("@invoice_saving", { timeout: 200000 });

    cy.get("#content_docOverview .docovstep").should("contain", "Payée");
  });

  // blandit@wanadoo.fr
  // hV51U6O5

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
