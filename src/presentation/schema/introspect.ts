import {PathsObject, SchemaObject} from 'openapi3-ts';
import {
  internalServerError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

export const introspectPaths: PathsObject = {
  '/introspect': {
    get: {
      summary: 'Introspection du jeton donné en paramètre',
      description:
        'Cet endpoint permet de découvrir les informations correspondant à un jeton donné',
      tags: ['Jeton'],
      responses: {
        '200': {
          description: "L'introspection du jeton",
          content: {
            'application/json': {
              schema: <SchemaObject>{
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Id du jeton introspecté',
                  },
                  name: {
                    type: 'string',
                    description: 'Nom associé au jeton',
                  },
                  scopes: {
                    type: 'array',
                    description: 'Scopes techniques associés au jeton',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '500': internalServerError,
      },
    },
  },
};
