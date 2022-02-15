import {OperationObject, PathsObject, ResponseObject} from 'openapi3-ts';
import {
  internalServerError,
  mesriNotFoundError,
  networkError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

const successResponse: ResponseObject = {
  description: "La situation d'un étudiant boursier",
  content: {
    'application/json': {
      schema: {
        properties: {
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
          prenom2: {
            type: 'string',
            description: 'Le deuxième prénom',
            example: 'Claude',
          },
          dateNaissance: {
            type: 'string',
            format: 'date',
            description: 'La date de naissance',
            example: '1992-11-29',
          },
          lieuNaissance: {
            type: 'string',
            description: 'Le lieu de naissance',
            example: 'Poitiers',
          },
          sexe: {
            type: 'string',
            description: "Le sexe de l'étudiant",
            example: 'M',
            enum: ['M', 'F'],
          },
          boursier: {
            type: 'boolean',
            description: "L'étudiant est-il boursier ?",
            example: true,
          },
          echelonBourse: {
            type: 'string',
            description: "L'échelon de bourse de l'étudiant, de 0bis à 8",
            example: '6',
          },
          email: {
            type: 'string',
            description: "L'adresse email de l'étudiant",
            example: 'georges@moustaki.fr',
          },
          dateDeRentree: {
            type: 'string',
            format: 'date',
            description: "La date de rentrée de l'étudiant",
            example: '2019-09-01',
          },
          dureeVersement: {
            type: 'number',
            description: 'La durée du versement de la bourse, en mois',
            example: 12,
          },
          statut: {
            type: 'number',
            description:
              'Le statut de la bourse, 0 si définitif, >0 si provisoire (conditionnel)',
            examples: [0, 3],
          },
          statutLibelle: {
            type: 'string',
            description: 'Le libellé assoccié au statut',
            examples: ['définitif', 'provisoire (conditionnel)'],
          },
          villeEtudes: {
            type: 'string',
            description: "Le ville d'étude de l'étudiant",
            example: 'Brest',
          },
          etablissement: {
            type: 'string',
            description: "L'établissement d'étude de l'étudiant",
            example: 'Carnot',
          },
        },
      },
    },
  },
};

const summary = "Recherche du statut étudiant boursier d'un particulier";

export const cnousPaths: PathsObject = {
  '/v2/etudiants-boursiers': {
    get: <OperationObject>{
      tags: ['Statut étudiant boursier'],
      parameters: [
        {
          name: 'ine',
          in: 'query',
          schema: {
            type: 'string',
            pattern: '^[0-9a-zA-Z]{11}$',
          },
        },
        {
          name: 'nom',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'prenoms',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'dateDeNaissance',
          in: 'query',
          schema: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          },
        },
        {
          name: 'lieuDeNaissance',
          in: 'query',
          schema: {
            type: 'string',
            required: false,
          },
        },
        {
          name: 'sexe',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
      ],
      summary,
      description: `Le service permet de récupérer le statut étudiant boursier d'un particulier, avec les données relatives à sa bourse.

**Paramètres d'appel :** (mutuellement exclusifs, l'appel par INE est réservé aux acteurs de la sphère de l'enseignement)
 - INE, l'Identifiant National Étudiant
 - état civil, constitué du nom, prénoms, date de naissance, sexe et lieu de naissance

**Données disponibles en bac à sable :** [liste](https://airtable.com/invite/l?inviteId=inv9lBycvDR5UzbyM&inviteToken=6e46235c19bbb4a70dd31ab483eb7375ac0bf46c9d8145d1358e0aa50f65277a&utm_source=email)`,
      responses: {
        '200': successResponse,
        '401': unauthorizedResponse,
        '404': mesriNotFoundError,
        '503': networkError,
        '500': internalServerError,
      },
    },
  },
};

export const cnousFranceConnectPaths: PathsObject = {
  '/v2/etudiants-boursiers': {
    get: <OperationObject>{
      tags: ['Statut étudiant boursier'],
      summary,
      description: `Le service permet de récupérer le statut étudiant boursier d'un particulier, avec les données relatives à sa bourse.

**Données disponibles en bac à sable :** [liste](https://airtable.com/invite/l?inviteId=inv9lBycvDR5UzbyM&inviteToken=6e46235c19bbb4a70dd31ab483eb7375ac0bf46c9d8145d1358e0aa50f65277a&utm_source=email)`,
      responses: {
        '200': successResponse,
        '401': unauthorizedResponse,
        '404': mesriNotFoundError,
        '503': networkError,
        '500': internalServerError,
      },
    },
  },
};
