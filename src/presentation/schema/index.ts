import {readFileSync} from 'fs';
import {OpenApiBuilder} from 'openapi3-ts';
import {join} from 'path';
import {cafPaths} from 'src/presentation/schema/caf';
import {dgfipPaths} from 'src/presentation/schema/dgfip';
import {introspectPaths} from 'src/presentation/schema/introspect';
import {
  mesriFranceConnectPaths,
  mesriPaths,
} from 'src/presentation/schema/mesri';
import {pingPaths} from 'src/presentation/schema/ping';
import {poleEmploiPaths} from 'src/presentation/schema/pole-emploi';

const generalInformationGetter = (docPath: string) => ({
  info: {
    title: 'API Particulier',
    version: '2.1.0',
    contact: {
      email: 'contact@particulier.api.gouv.fr',
      name: 'Contact API Particulier',
      url: 'https://api.gouv.fr/les-api/api-particulier',
    },
    termsOfService: 'https://api.gouv.fr/resources/CGU%20API%20Particulier.pdf',
    license: {
      name: 'GNU Affero General Public License v3.0',
      url: 'https://github.com/betagouv/api-particulier/blob/master/LICENSE',
    },
    description: readFileSync(join(__dirname, `${docPath}.md`), 'utf-8'),
  },
  openapi: '3.0.0',
  servers: [
    {
      url: 'https://particulier-test.api.gouv.fr/api',
      description: 'Serveur de bac à sable',
    },
    {
      url: 'https://particulier.api.gouv.fr/api',
      description: 'Serveur de production',
    },
  ],
});

export const schemaWithApiKey = new OpenApiBuilder({
  ...generalInformationGetter('documentation'),
  security: [
    {
      apiKey: [],
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Api-Key',
        description:
          'Jeton d\'authentification obtenu suite à la validation de votre <a href="https://datapass.api.gouv.fr/">demande d\'habilitation</a>, visible sur <a href="https://mon.portail.api.gouv.fr">le portail API Particulier</a>',
      },
    },
  },
  paths: {
    ...dgfipPaths,
    ...cafPaths,
    ...poleEmploiPaths,
    ...mesriPaths,
    ...introspectPaths,
    ...pingPaths,
  },
});

export const schemaWithFranceConnectToken = new OpenApiBuilder({
  ...generalInformationGetter('documentation-france-connect'),
  security: [
    {
      franceConnectToken: [],
    },
  ],
  components: {
    securitySchemes: {
      franceConnectToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Jeton FranceConnect',
        description:
          'Jeton FranceConnect obtenu suite à une cinématique de connexion FranceConnect',
      },
    },
  },
  paths: {
    ...mesriFranceConnectPaths,
  },
});
