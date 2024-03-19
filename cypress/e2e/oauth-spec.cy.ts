describe("OAuth login flow", () => {
  it("successfully logs in via OAuth and redirects back with a session", () => {
    cy.visit(Cypress.env("localhost_url"));
    cy.get('[data-cy="navbar"]').should("not.contain", "log out");

    cy.get(".inline-flex").click();
    cy.wait(1000);

    cy.origin(Cypress.env("yggio_url"), () => {
      cy.get('[data-cy="login-username"]').type(Cypress.env("username"));
      cy.get('[data-cy="login-password"]').type(Cypress.env("password"));
      cy.get('[data-cy="login-SignInButton"]').click();
    });

    cy.url().should("include", Cypress.env("localhost_url"));
    cy.get('[data-cy="navbar"]').contains("log out");
  });
});
