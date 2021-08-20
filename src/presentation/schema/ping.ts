import {PathsObject, SchemaObject} from 'openapi3-ts';
import {internalServerError} from 'src/presentation/schema/errors';

const pingReponses = {
  '200': {
    description: 'pong',
    content: {
      'application/json': {
        schema: <SchemaObject>{
          type: 'string',
          example: 'pong',
          pattern: '^pong$',
        },
      },
    },
  },
  '500': internalServerError,
};

export const pingPaths: PathsObject = {
  '/ping': {
    get: {
      summary: 'Statut des serveurs applicatifs API Particulier',
      description:
        "Ce endpoint permet de connaitre l'état du serveur API Particulier.\nSi le résultat est autre qu'un code HTTP 200, le serveur rencontre un problème.\nOn peut alors considérer que les résultat des autres endpoints seront perturbés.\n",
      tags: ['Ping'],
      security: [],
      responses: pingReponses,
    },
  },
  '/impots/ping': {
    get: {
      summary: 'Status des serveurs de la DGFIP',
      description:
        "Ce endpoint permet de connaitre l'état du serveur de la DGFIP sur lequel s'appuie API Particulier pour vous restituer les données impôts.\nSi le résultat est autre qu'un code HTTP 200, le serveur de la DGFIP rencontre un problème.\nOn peut alors considérer que les résultats du endpoint /impots/svair seront perturbés.\n",
      tags: ['Ping'],
      security: [],
      deprecated: true,
      responses: pingReponses,
    },
  },
  '/caf/ping': {
    get: {
      summary: 'Status des serveurs de la CAF',
      description:
        "Ce endpoint permet de connaitre l'état du serveur de la CAF sur lequel s'appuie API Particulier pour vous restituer les données famille.\nSi le résultat est autre qu'un code HTTP 200, le serveur de la CAF rencontre un problème.\nOn peut alors considérer que les résultats du endpoint /caf/famille seront perturbés.\n",
      tags: ['Ping'],
      deprecated: true,
      security: [],
      responses: pingReponses,
    },
  },
};
