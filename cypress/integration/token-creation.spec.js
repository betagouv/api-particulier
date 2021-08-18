const {describe, it} = require('mocha');

describe('The portail', () => {
  it('Clears the auth cookies', () => {
    const issuerUrl = Cypress.env('ISSUER_URL');
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const url = new URL(issuerUrl);
    cy.visit(`${url.protocol}//${url.hostname}/users/sign-in`);
    cy.clearCookies();
  });

  it('Is not exposed on the root domain', () => {
    cy.visit('http://localhost:3000', {failOnStatusCode: false});

    cy.contains('Cannot GET /');
  });

  it('Is exposed on the portail domain', () => {
    cy.visit(Cypress.env('BASE_URL'), {failOnStatusCode: false});
    cy.get('input[name="login"]').type(Cypress.env('TEST_OIDC_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('TEST_OIDC_PASSWORD'));
    cy.get('form').submit();

    cy.contains("Vous n'avez pas de jeton associé à votre email");
  });
});
