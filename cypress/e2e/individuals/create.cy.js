const individual = {
  firstname: "Jacques",
  name: "Weber",
  dateOfBirth: "10/06/1982",
  email: "j.weber@gmail.com",
  phone: "+33 5 46 84 99 99",
  mobile: "+33 6 99 42 42 42",
};

describe("individuals : create", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  context("context 1", function () {
    it("should create a user", () => {
      // ARRANGE
      cy.visit("/individuals/create");

      // ACT
      cy.get(
        "section.flex-column > :nth-child(3) > .el-form-item__content > .el-input > .el-input__inner"
      )
        .clear()
        .type(individual.name);
      cy.get(
        ":nth-child(4) > .el-form-item__content > .el-input > .el-input__inner"
      )
        .clear()
        .type(individual.firstname);
      cy.get(".el-date-editor > .el-input__inner")
        .type(individual.dateOfBirth)
        .type("{enter}");
      cy.get(
        ":nth-child(6) > .el-form-item__content > .el-input > .el-input__inner"
      ).type(individual.email);
      cy.get(
        ":nth-child(1) > .el-form-item__content > .vue-tel-input > input"
      ).type(individual.phone);
      cy.get(
        ":nth-child(2) > .el-form-item__content > .vue-tel-input > input"
      ).type(individual.mobile);
      cy.get(".el-button--primary").click({ force: true });

      // ASSERT
      cy.get(
        "#contentDiv > div.contentMargin > div:nth-child(1) > div > div > div.flex-row > div.flex-level.flex-column.flex > div.well.p-0.flex-level.flex-top.ovy-auto.hp-10 > section:nth-child(1) > div > div > ul > li:nth-child(1) > div > span.data-value"
      ).should(($fullname) => {
        expect($fullname).to.contain(individual.name);
        expect($fullname).to.contain(individual.firstname);
      });
      cy.get(
        ':nth-child(2) > [format="phone"] > .data-value > .black-link'
      ).should(($phone) => {
        expect($phone).to.contain(individual.phone);
      });
      cy.get(
        ':nth-child(3) > [format="phone"] > .data-value > .black-link'
      ).should(($mobile) => {
        expect($mobile).to.contain(individual.mobile);
      });
      cy.get(
        ':nth-child(4) > [format="email"] > .data-value > .black-link'
      ).should(($email) => {
        expect($email).to.contain(individual.email);
      });
    });

    it("should have the created user in the listing", () => {
      // ARRANGE
      cy.visit("/directory/individuals");

      // ASSERT
      cy.get(".el-table__row")
        .first()
        .should(($row) => {
          expect($row).to.contain(individual.name);
        });
    });
  });
});
