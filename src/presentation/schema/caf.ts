import {PathObject, PathsObject, SchemaObject} from 'openapi3-ts';
import {
  cafError,
  cafNotFoundError,
  internalServerError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

const person = <SchemaObject>{
  type: 'object',
  properties: {
    nomPrenom: {
      type: 'string',
      description: 'Noms et prénoms des personnes allocataires de la CAF',
    },
    dateDeNaissance: {
      type: 'string',
      pattern: '^d{8}$',
      description: 'Date de naissance au format: JJMMAAAA',
    },
    sexe: {
      type: 'string',
      enum: ['F', 'M'],
    },
  },
};

const cafPathBuilder = (deprecated: boolean): PathObject => ({
  get: {
    summary: 'Informations concernant la famille',
    description:
      "Le service permet de récupérer la composition de la famille, l'adresse déclarée à la CAF, ainsi que le quotient familial. Les données sont actualisées chaque mois.",
    parameters: [
      {
        name: 'numeroAllocataire',
        in: 'query',
        description: "Numéro d'allocataire",
        required: true,
        schema: {
          type: 'number',
          format: 'string',
        },
      },
      {
        name: 'codePostal',
        in: 'query',
        description: 'Code postal',
        required: true,
        schema: {
          type: 'number',
          format: 'string',
        },
      },
    ],
    deprecated,
    tags: ['QF', 'CAF'],
    responses: {
      '200': {
        description: "Foyer tel qu'il est déclaré à la CAF",
        content: {
          'application/json': {
            schema: <SchemaObject>{
              type: 'object',
              properties: {
                allocataires: {
                  type: 'array',
                  items: person,
                },
                enfants: {
                  type: 'array',
                  items: person,
                },
                adresse: {
                  type: 'object',
                  properties: {
                    codePostal: {
                      type: 'string',
                    },
                    INSEECommune: {
                      type: 'string',
                    },
                    localite: {
                      type: 'string',
                    },
                    ligneVoie: {
                      type: 'string',
                    },
                    ligneComplementDestinaire: {
                      type: 'string',
                    },
                    ligneComplementAdresse: {
                      type: 'string',
                    },
                    ligneComplementDistribution: {
                      type: 'string',
                    },
                    ligneNom: {
                      type: 'string',
                    },
                  },
                },
                quotientFamilial: {
                  type: 'integer',
                  description: 'Valeur du quotient familial calculé par la CAF',
                },
                annee: {
                  type: 'integer',
                  description: 'Année du quotient familial',
                },
                mois: {
                  type: 'integer',
                  description: 'Mois du quotient familial',
                },
              },
            },
          },
        },
      },
      '401': unauthorizedResponse,
      '404': cafNotFoundError,
      '500': internalServerError,
      '503': cafError,
    },
  },
});

export const cafPaths: PathsObject = {
  '/caf/famille': cafPathBuilder(true),
  '/v2/situation-familiale': cafPathBuilder(false),
};
