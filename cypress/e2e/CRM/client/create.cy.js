import createRandomClient from "./_data";

describe("client : create", () => {
  let client;

  before(() => {
    client = createRandomClient();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.deleteAllClients();
  });

  it("should create a client", () => {
    // ARRANGE
    cy.intercept("GET", "/rest/third/client/init/*").as("get_client_infos");

    // ACT
    cy.createClient(client);

    cy.wait("@get_client_infos", { timeout: 200000 });

    // ASSERT
    cy.get(".mt-0 > .flex-level > .el-tooltip").as("overview_header");
    cy.get("@overview_header").should(
      "contain",
      `${client.firstname} ${client.lastName}`
    );
  });
});
