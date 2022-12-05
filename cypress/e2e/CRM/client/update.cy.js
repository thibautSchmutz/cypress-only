import createRandomClient from "./_data";
import Rd from "../../../utils/index.js";

describe("client : update", () => {
  let client;
  let newClient;

  before(() => {
    client = createRandomClient();
    newClient = createRandomClient();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
    cy.createClient(client);
  });

  it("should be updatable", () => {
    // ARRANGE
    const searchTerms = `${client.firstname} ${client.lastName}`;

    cy.intercept("GET", `https://api.slsy.io/v2/search?q=*`).as(
      "search_results"
    );
    cy.intercept("GET", "https://api.slsy.io/v2/staffs*").as("overview_loaded");
    cy.intercept("GET", "/rest/third/client/init/").as("get_client_infos");
    cy.intercept("POST", "/?_f=third").as("update_client_generic_request");

    // ACT
    cy.visit("/");

    cy.get(
      ".fast-search-input > :nth-child(1) > .el-input > .el-input__inner"
    ).as("global_search_input");
    cy.get("@global_search_input").type(searchTerms);

    cy.wait("@search_results");

    cy.get(".mt-3 > .my-1 > .hover-primary-05-bkg > .pointer > .flex-level").as(
      "client_result_link"
    );
    cy.get("@client_result_link").click({ force: true });

    cy.wait("@overview_loaded");

    cy.findByText("Actions").as("overview_action_btn");
    cy.get("@overview_action_btn").click({ force: true });

    cy.findByText("Modifier la société").as("update_client_info_btn");
    cy.get("@update_client_info_btn").click({ force: true });

    cy.wait("@update_client_generic_request");

    cy.get("#third_mobile").as("mobile_input");
    cy.get("@mobile_input").clear().type(newClient.mobile);

    cy.get("#third_email").as("email_input");
    cy.get("@email_input").clear().type(newClient.email);

    cy.get(".redactor_redactor").as("note_textarea");
    cy.get("@note_textarea").clear().type(newClient.note);

    cy.get(".ui-dialog-buttonset > .btn-primary").as("submit_btn");
    cy.get("@submit_btn").click({ force: true });

    cy.wait("@update_client_generic_request", { timeout: 200000 });

    cy.getByDataBot("client-overview__menu--general-info").as(
      "overview_general_infos_btn"
    );

    cy.get("@overview_general_infos_btn").click({ force: true });

    // ASSERT
    cy.get(".flex-level.flex-column").as("overview_content");

    // Unchanged values
    cy.get("@overview_content").should("contain", client.phone);
    cy.get("@overview_content").should("contain", client.social.facebook);
    cy.get("@overview_content").should("contain", client.social.linkedin);
    cy.get("@overview_content").should("contain", client.social.viadeo);
    // Updated values
    cy.get("@overview_content").should("contain", newClient.note);
    cy.get("@overview_content").should("contain", newClient.mobile);
    cy.get("@overview_content").should("contain", newClient.email);
  });
});
