module.export = Cypress.Commands.add("deleteAllClients", () => {
  cy.log("ACTION : delete all clients");

  cy.intercept("POST", "/listing/clients").as("get_listing_data");
  cy.intercept("POST", "?_f=thirds").as("deletion_completed");

  cy.visit(`/directory/clients`);
  cy.wait("@get_listing_data");

  // If active filters, delete them
  cy.get(".leftpane").as("filter_panel");
  cy.intercept("DELETE", `/listing/clients/filters`).as(
    "delete_listing_filters"
  );
  cy.get("@filter_panel").then(($panel) => {
    if ($panel.find("a.pull-right.semibold").length) {
      cy.log("Some filters are active");
      cy.get("a.pull-right.semibold").as("filters_reset_btn");
      cy.get("@filters_reset_btn").click({ force: true });
      cy.wait("@delete_listing_filters");
      cy.log("Filters cleared");
    } else {
      cy.log("No active filters");
    }
  });

  // If any items found, delete them
  cy.get(".listingContainer").as("listing_container");
  cy.get("@listing_container").then(($listing_container) => {
    if ($listing_container.find("a.subcell").length) {
      cy.log(`clients found`);

      cy.get(
        ".el-table__fixed > .el-table__fixed-header-wrapper > .el-table__header > thead > tr > .el-table_1_column_1 > .cell > label"
      ).as("select_all_checkbox");
      cy.get("@select_all_checkbox").click({ force: true });

      cy.findAllByPlaceholderText("— Choisissez une action à effectuer —").as(
        "action_select"
      );
      cy.get("@action_select").click({ force: true });

      cy.findByText("Supprimer la société et ses données").as(
        "delete_all_option"
      );
      cy.get("@delete_all_option").click({ force: true });

      cy.get("button").contains("Valider").as("validate_action_btn");
      cy.get("@validate_action_btn").click({ force: true });

      cy.get("#risk-awareness").as("confirm_checkbox");
      cy.get("@confirm_checkbox").click({ force: true });

      cy.get("button").contains("Supprimer les données").as("delete_data_btn");
      cy.get("@delete_data_btn").click({ force: true });

      cy.wait("@deletion_completed");

      cy.log(`clients deleted`);
    } else {
      cy.log(`No clients found`);
    }
  });
});
