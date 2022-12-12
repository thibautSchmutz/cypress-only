module.exports = Cypress.Commands.add("selectOpportunity", (corpName) => {
  cy.log("ACTION : select an opportunity");

  cy.intercept("POST", "/listing/opportunities").as("get_opportunity_listings");

  cy.visit(`/opportunities`);
  cy.wait("@get_opportunity_listings", { timeout: 200000 });

  // If active filters, delete them
  cy.get(".leftpane").as("filter_panel");

  cy.get("@filter_panel").then(($panel) => {
    if ($panel.find("a.pull-right.semibold").length) {
      cy.log("Some filters are active");
      cy.get(".filters_summary .close-btn").as("filters_reset_btn");
      cy.get("@filters_reset_btn").click({ force: true, multiple: true });
      cy.wait("@get_opportunity_listings", { timeout: 200000 });
      cy.log("Filters cleared");
    } else {
      cy.log("No active filters");
    }
  });

  // If any items found, find one with name and click on it
  cy.get(".listingContainer").as("listing_container");
  cy.get("@listing_container").then(($listing_container) => {
    if ($listing_container.find("a.subcell").length) {
      cy.log(`opportunity exists ${corpName}`);

      cy.get(".el-table .cell a").contains(corpName).click({ force: true });

      cy.log(`opportunity found`);
    } else {
      cy.log(`No opportunities found`);
    }
  });
});
