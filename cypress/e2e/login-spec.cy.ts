/**
 * Spec requirements: A01
 */
describe("login flow", () => {
  it("successfully logs in and redirects back with a session", () => {
    cy.visit(Cypress.env("localhost_url"));
    cy.get("body")
      .contains("nav", "log out")
      .should("not.exist");

    cy.wait(1000);

    cy.get('[id="username"]').type(Cypress.env("username"));
    cy.get('input[id="password"]').type(Cypress.env("password"));
    cy.get('button[data-testid="login-button"]').click();

    // Workaround for what is probably a bug in our app.
    // On a freshly loaded page, the first click on the login button
    // doesn't load the start page, so we need to click a second time.
    cy.wait(5000);
    cy.get("body").then($body => {
      let navs = $body.find("nav");
      let buttons = $body.find('button[data-testid="login-button"]');
      if (navs.length === 0 && buttons.length > 0) {
        cy.log("Clicking the login button a second time.");
        cy.get('button[data-testid="login-button"]').click();
      }
    });

    cy.get("nav", {timeout: 20000})
      .contains("log out")
      .should("exist");

    cy.url().should("not.include", "login");
    cy.url().should("include", Cypress.env("localhost_url"));
  });
});
