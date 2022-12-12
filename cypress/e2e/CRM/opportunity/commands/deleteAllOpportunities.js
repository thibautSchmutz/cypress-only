module.export = Cypress.Commands.add("deleteAllOpportunities", () => {
  cy.log("ACTION : delete all opportunities");

  cy.intercept("POST", "/listing/opportunities").as(
    "get_opportunity_listing_data"
  );
  cy.intercept("POST", "/?_f=prospection_opportunity").as("deletion_completed");

  cy.visit(`/opportunities`);
  cy.wait("@get_opportunity_listing_data", { timeout: 200000 });

  // If active filters, delete them
  cy.get(".leftpane").as("filter_panel");
  cy.intercept("DELETE", `/listing/opportunities/filters`).as(
    "reset_opportunity_listing_filters"
  );
  cy.get("@filter_panel").then(($panel) => {
    if ($panel.find("a.pull-right.semibold").length) {
      cy.log("Some filters are active");
      cy.get("a.pull-right.semibold").as("filters_reset_btn");
      cy.get("@filters_reset_btn").click({ force: true });
      cy.wait("@reset_opportunity_listing_filters", { timeout: 200000 });
      cy.log("Filters cleared");
    } else {
      cy.log("No active filters");
    }
  });

  // If any items found, delete them
  cy.get(".listingContainer").as("listing_container");
  cy.get("@listing_container").then(($listing_container) => {
    if ($listing_container.find("a.subcell").length) {
      cy.log(`opportunities found`);

      cy.get(
        ".el-table__fixed > .el-table__fixed-header-wrapper > .el-table__header > thead > tr > .el-table_1_column_1 > .cell > label"
      ).as("select_all_checkbox");
      cy.get("@select_all_checkbox").click({ force: true });

      cy.get('input[placeholder="— Choisissez une action à effectuer —"]').as(
        "action_select"
      );
      // cy.findAllByPlaceholderText("— Choisissez une action à effectuer —").as(
      //   "action_select"
      // );
      cy.get("@action_select").click({ force: true });

      cy.get(".el-select-dropdown__item")
        .contains("Supprimer")
        .as("delete_all_option");
      cy.get("@delete_all_option").click({ force: true });

      cy.get("button").contains("Valider").as("validate_action_btn");
      cy.get("@validate_action_btn").click({ force: true });

      cy.get("button")
        .contains("Supprimer les opportunités")
        .as("delete_data_btn");
      cy.get("@delete_data_btn").click({ force: true });

      cy.wait("@deletion_completed", { timeout: 200000 });

      cy.log(`opportunities deleted`);
    } else {
      cy.log(`No opportunities found`);
    }
  });
});
