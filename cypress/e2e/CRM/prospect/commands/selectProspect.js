module.exports = Cypress.Commands.add("selectProspect", (corpName) => {
  cy.log("ACTION : select a propsect");

  cy.intercept("POST", "/listing/prospects").as("get_propspect_listings");

  cy.visit(`/directory/prospects`);
  cy.wait("@get_propspect_listings", { timeout: 200000 });

  // If active filters, delete them
  cy.get(".leftpane").as("filter_panel");
  cy.intercept("DELETE", `/listing/prospects/filters`).as(
    "delete_listing_filters"
  );
  cy.get("@filter_panel").then(($panel) => {
    if ($panel.find("a.pull-right.semibold").length) {
      cy.log("Some filters are active");
      cy.get("a.pull-right.semibold").as("filters_reset_btn");
      cy.get("@filters_reset_btn").click({ force: true });
      cy.wait("@delete_listing_filters", { timeout: 200000 });
      cy.log("Filters cleared");
    } else {
      cy.log("No active filters");
    }
  });

  // If any items found, find one with name and click on it
  cy.get(".listingContainer").as("listing_container");
  cy.get("@listing_container").then(($listing_container) => {
    if ($listing_container.find("a.subcell").length) {
      cy.log(`prospects exist ${corpName}`);

      cy.get(".el-table .cell a").contains(corpName).click({ force: true });

      cy.log(`prospect found`);
    } else {
      cy.log(`No prospects found`);
    }
  });
});
