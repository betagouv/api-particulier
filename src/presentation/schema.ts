import {readFileSync} from 'fs';
import {OpenApiBuilder} from 'openapi3-ts';
import {join} from 'path';

export const schema = new OpenApiBuilder({
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
    description: readFileSync(join(__dirname, 'documentation.md'), 'utf-8'),
  },
  openapi: '3.0.0',
  servers: [
    {
      url: 'https://particulier-test.api.gouv.fr',
      description: 'Serveur de bac à sable',
    },
    {
      url: 'https://particulier.api.gouv.fr',
      description: 'Serveur de production',
    },
  ],
  paths: [],
});
