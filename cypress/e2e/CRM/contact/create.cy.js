import data from "./_data";

describe("individuals : create", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should create a user", () => {
    // ARRANGE
    cy.visit("/individuals/create");

    // ACT
    cy.get(
      "section.flex-column > :nth-child(3) > .el-form-item__content > .el-input > .el-input__inner"
    )
      .clear()
      .type(data.name);
    cy.get(
      ":nth-child(4) > .el-form-item__content > .el-input > .el-input__inner"
    )
      .clear()
      .type(data.firstname);
    cy.get(".el-date-editor > .el-input__inner")
      .type(data.dateOfBirth)
      .type("{enter}");
    cy.get(
      ":nth-child(6) > .el-form-item__content > .el-input > .el-input__inner"
    ).type(data.email);
    cy.get(
      ":nth-child(1) > .el-form-item__content > .vue-tel-input > input"
    ).type(data.phone);
    cy.get(
      ":nth-child(2) > .el-form-item__content > .vue-tel-input > input"
    ).type(data.mobile);
    cy.get(".el-button--primary").click({ force: true });

    // ASSERT
    cy.get(
      "#contentDiv > div.contentMargin > div:nth-child(1) > div > div > div.flex-row > div.flex-level.flex-column.flex > div.well.p-0.flex-level.flex-top.ovy-auto.hp-10 > section:nth-child(1) > div > div > ul > li:nth-child(1) > div > span.data-value"
    ).should(($fullname) => {
      expect($fullname).to.contain(data.name);
      expect($fullname).to.contain(data.firstname);
    });
    cy.get(
      ':nth-child(2) > [format="phone"] > .data-value > .black-link'
    ).should(($phone) => {
      expect($phone).to.contain(data.phone);
    });
    cy.get(
      ':nth-child(3) > [format="phone"] > .data-value > .black-link'
    ).should(($mobile) => {
      expect($mobile).to.contain(data.mobile);
    });
    cy.get(
      ':nth-child(4) > [format="email"] > .data-value > .black-link'
    ).should(($email) => {
      expect($email).to.contain(data.email);
    });
  });

  it("should have the created user in the listing", () => {
    // ARRANGE
    cy.visit("/directory/individuals");

    // ASSERT
    cy.get(".el-table__row")
      .first()
      .should(($row) => {
        expect($row).to.contain(data.name);
      });
  });
});
