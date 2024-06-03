import { join } from "path";

/**
 * Spec requirements: E01
 */
describe("ESG report", () => {
  const downloadsFolder = Cypress.config("downloadsFolder");
  const filename = join(downloadsFolder, "ESG Report.xlsx");

  beforeEach(() => {
    // Cypress has a trashAssetsBeforeRuns setting (enabled by default)
    // to clear the downloads directory before each run, but it literally
    // only applies to the "run" command and not when using the UI,
    // so we have to clear the files explicitly as well.
    // https://github.com/cypress-io/cypress/issues/14870
    return cy.task("deleteDirectory", downloadsFolder);
  });

  it("produces downloadable Excel file", () => {
    cy.login(Cypress.env("propertyowner_username"), Cypress.env("propertyowner_password"))
    cy.readFile(filename).should("not.exist");

    cy.get("main button").contains(/Download report/).click();
    cy.readFile(filename, "latin1", {timeout: 120000, log: false})
      .should('match', /^\x50\x4b\x03\x04/);
  })
});
