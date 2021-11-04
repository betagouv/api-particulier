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
    description: `Le service permet de récupérer la composition de la famille, l'adresse déclarée à la CAF, ainsi que le quotient familial. Les données sont actualisées chaque mois.

**Paramètres d'appel :** numéro d'allocataire et code postal

**Données disponibles en bac à sable :** [liste](https://airtable.com/invite/l?inviteId=invpeDu6xq16LHfI5&inviteToken=66173d447bcbdf7d43548facb7c6b38df1267f8481f1a21491410ff30ecb2c8b&utm_source=email)`,
    summary: 'Informations concernant la famille',
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
    tags: ['Situation CAF'],
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
                  description: 'Adresse au format de la poste',
                  properties: {
                    identite: {
                      type: 'string',
                      description:
                        'Identité du destinataire : Civilité, titre ou qualité + nom et prénom',
                    },
                    complementIdentite: {
                      type: 'string',
                      description:
                        "Complément d'information du destinataire ou point de remise : Numéro d'appartement, Escalier",
                    },
                    complementIdentiteGeo: {
                      type: 'string',
                      description:
                        "Complément d'information du point géographique : Entrée, tour, immeuble, bâtiment, Résidence",
                    },
                    numeroRue: {
                      type: 'string',
                      description: 'Numéro et libellé de la voie',
                    },
                    lieuDit: {
                      type: 'string',
                      description:
                        'Lieu-dit ou service particulier de distribution : poste restante, boîte postale',
                    },
                    codePostalVille: {
                      type: 'string',
                      description: 'Code postale et localité de destination',
                    },
                    pays: {
                      type: 'string',
                      description: 'Pays',
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
  '/v2/composition-familiale': cafPathBuilder(false),
};
