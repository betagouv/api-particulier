import {OperationObject, PathsObject, ResponseObject} from 'openapi3-ts';
import {
  internalServerError,
  mesriNotFoundError,
  networkError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

export const mesriPaths: PathsObject = {
  '/v2/etudiants': {
    get: <OperationObject>{
      tags: ['Statut étudiant'],
      parameters: [
        {
          name: 'ine',
          in: 'query',
          schema: {
            type: 'string',
          },
          required: true,
        },
      ],
      responses: {
        '200': <ResponseObject>{
          description: "La situation d'un étudiant et ses inscriptions",
          content: {
            'application/json': {
              schema: {
                properties: {
                  ine: {
                    type: 'string',
                    description: "Identifiant unique de l'étudiant",
                    example: '1234567890G',
                  },
                  nom: {
                    type: 'string',
                    description: 'Le nom de naissance',
                    example: 'Moustaki',
                  },
                  prenom: {
                    type: 'string',
                    description: 'Le prénom',
                    example: 'Georges',
                  },
                  dateNaissance: {
                    type: 'string',
                    format: 'date',
                    description: 'La date de naissance',
                    example: '1992-11-29',
                  },
                  inscriptions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        dateDebutInscription: {
                          type: 'string',
                          format: 'date',
                          description:
                            "La date de début d'inscription à l'établissement",
                          example: '2019-09-01',
                        },
                        dateFinInscription: {
                          type: 'string',
                          format: 'date',
                          description:
                            "La date de fin d'inscription à l'établissement",
                          example: '2020-06-29',
                        },
                        statut: {
                          type: 'string',
                          description: "Le statut de l'inscription",
                          example: 'admis',
                          enum: ['admis', 'inscrit'],
                        },
                        regime: {
                          type: 'string',
                          description: 'Le régime de formation',
                          example: 'formation initiale',
                          enum: ['formation initiale', 'formation continue'],
                        },
                        codeCommune: {
                          type: 'string',
                          description: 'Le code commune',
                          example: '29085',
                        },
                        etablissement: {
                          type: 'object',
                          properties: {
                            uai: {
                              type: 'string',
                              description:
                                "Identifiant unique de l'établissement",
                              example: '0011402U',
                            },
                            nom: {
                              type: 'string',
                              description: "Nom de l'établissement",
                              example:
                                'EGC AIN BOURG EN BRESSE EC GESTION ET COMMERCE (01000)',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '404': mesriNotFoundError,
        '503': networkError,
        '500': internalServerError,
      },
    },
  },
};
