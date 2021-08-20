import {OperationObject, PathsObject, ResponseObject} from 'openapi3-ts';
import {
  internalServerError,
  networkError,
  poleEmploiNotFoundError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

export const poleEmploiPaths: PathsObject = {
  '/v2/situations-pole-emploi': {
    get: <OperationObject>{
      summary: "Recherche de la situation Pôle Emploi d'un particulier",
      description: `Le service permet de récupérer la situation Pôle Emploi d'un particulier, avec ses données d'état civil et ses données relatives à son inscription à Pôle Emploi.

**Paramètres d'appel :** identifiant "PeamU" Pôle Emploi choisi par le particulier lors de la création de son compte en ligne

**Jetons de bac à sable associés à cette route :**
 - Pôle Emploi - Identité, Contact, Adresse et Inscription : fd38830c480221d0ff0b6013c4de6c32
 - Pôle Emploi - Identité : d76d8c36-f49d-4c26-b849-7466a9faf0d6
 - Pôle Emploi - Contact : b70015d5-6ecd-48a6-9a2b-9fdb9fdf1c67
 - Pôle Emploi - Adresse : 438e839a-da85-4e10-a314-98092b856989
 - Pôle Emploi - Inscription : d726502d-ac6d-483f-b8b8-c9ba239547a6
 
**Données disponibles en bac à sable :** [liste](https://airtable.com/invite/l?inviteId=inv1n0CkFzq3Y0pvn&inviteToken=a5b49ec5bb9d2323df4adbdfc6c65da35a2248af30c38095101b3cca6ea0898a&utm_source=email)`,
      parameters: [
        {
          name: 'identifiant',
          required: true,
          in: 'query',
          description:
            "Identifiant Pôle Emploi de l'individu recherché, aussi appelé PeamU",
          schema: {type: 'string'},
        },
      ],
      tags: ['Situation Pôle Emploi'],
      responses: {
        '200': <ResponseObject>{
          description: "La situation Pôle Emploi d'un individu",
          content: {
            'application/json': {
              schema: {
                properties: {
                  identifiant: {
                    type: 'string',
                  },
                  civilite: {
                    type: 'string',
                  },
                  nom: {
                    type: 'string',
                  },
                  nomUsage: {
                    type: 'string',
                  },
                  prenom: {
                    type: 'string',
                  },
                  sexe: {
                    type: 'string',
                  },
                  dateNaissance: {
                    format: 'date',
                    type: 'string',
                  },
                  codeCertificationCNAV: {
                    type: 'string',
                  },
                  telephone: {
                    type: 'string',
                  },
                  telephone2: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
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
                  dateInscription: {
                    format: 'date',
                    type: 'string',
                  },
                  dateCessationInscription: {
                    format: 'date',
                    type: 'string',
                  },
                  codeCategorieInscription: {
                    type: 'integer',
                  },
                  libelleCategorieInscription: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '404': poleEmploiNotFoundError,
        '503': networkError,
        '500': internalServerError,
      },
    },
  },
};
