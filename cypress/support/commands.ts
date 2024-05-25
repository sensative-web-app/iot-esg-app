/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("login", (username, password) => {
  cy.visit(Cypress.env("localhost_url"));
  cy.get("body")
    .contains("nav", "log out")
    .should("not.exist");

  cy.wait(1000);

  cy.get('[id="username"]').type(username);
  cy.get('input[id="password"]').type(password);
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

  cy.get("nav", { timeout: 20000 })
    .contains("log out")
    .should("exist");

  cy.url().should("not.include", "login");
  cy.url().should("include", Cypress.env("localhost_url"));
})
