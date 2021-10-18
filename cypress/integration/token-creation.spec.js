const {describe, it} = require('mocha');
const qs = require('qs');

describe('API Particulier', () => {
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

  it('Is exposed on the portail domain with no token by default', () => {
    cy.visit(Cypress.env('BASE_URL'), {failOnStatusCode: false});
    cy.get('input[name="login"]').type(Cypress.env('TEST_OIDC_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('TEST_OIDC_PASSWORD'));
    cy.get('form').submit();

    cy.contains("Vous n'avez pas de jeton associé à votre email");
  });

  it('can be called by DataPass', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/applications',
      body: {
        name: 'Application de test',
        technical_contact_email: 'api-particulier@yopmail.com',
        author_email: 'api-particulier@yopmail.com',
        data_pass_id: 0,
        scopes: ['cnaf_adresse', 'dgfip_declarant1_nom', 'pole_emploi_adresse'],
      },
      headers: {
        'X-Api-Key': Cypress.env('DATAPASS_API_KEY'),
      },
    });
  });

  it('lists the tokens', () => {
    cy.visit(Cypress.env('BASE_URL'), {failOnStatusCode: false});
    cy.get('input[name="login"]').type(Cypress.env('TEST_OIDC_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('TEST_OIDC_PASSWORD'));
    cy.get('form').submit();

    cy.contains('Application de test');

    cy.get('.select-all').then(tokenElement => {
      const token = tokenElement.text();
      cy.request({
        method: 'GET',
        url: `http://localhost:3000/api/v2/situations-pole-emploi?${qs.stringify(
          {
            identifiant: Cypress.env('TEST_POLE_EMPLOI_ID'),
          }
        )}`,

        headers: {
          'X-Api-Key': token,
        },
      }).then(response => {
        expect(response.status).to.eq(200);
      });

      cy.request({
        method: 'GET',
        url: 'http://localhost:3000/api/introspect',
        headers: {
          'X-Api-Key': token,
        },
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
