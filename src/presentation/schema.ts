import {readFileSync} from 'fs';
import {OpenApiBuilder, PathItemObject, ResponseObject} from 'openapi3-ts';
import {join} from 'path';

const errorResponseBuilder = (payload: {
  error: string;
  reason: string;
  message: string;
}): ResponseObject => ({
  description: payload.message,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: payload.error,
          },
          reason: {
            type: 'string',
            example: payload.reason,
          },
          message: {
            type: 'string',
            example: payload.message,
          },
        },
      },
    },
  },
});

const unauthorizedResponse = errorResponseBuilder({
  error: 'access_denied',
  reason: 'Token not found or inactive',
  message: "Votre jeton d'API n'a pas été trouvé ou n'est pas actif",
});
const dgfipRateLimitedError = errorResponseBuilder({
  error: 'rate_limited',
  reason: 'DGFIP error rate limit exceeded',
  message:
    "Le fournisseur de donnée a rejeté la demande en raison d'un trop grand nombre d'échecs antérieurs.",
});
const dgfipNotFoundError = errorResponseBuilder({
  error: 'not_found',
  reason:
    'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
  message:
    'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
});
const invalidFormatError = errorResponseBuilder({
  error: 'invalid_response',
  reason: 'Data provider returned an invalid data format.',
  message: 'La réponse du fournisseur de donnée est inexploitable',
});
const networkError = errorResponseBuilder({
  error: 'network_error',
  reason: 'timeout of 10000 ms exceeded',
  message: "Une erreur est survenue lors de l'appel au fournisseur de donnée",
});
const internalServerError = errorResponseBuilder({
  error: 'error',
  reason: 'Internal server error',
  message: "Une erreur interne s'est produite, l'équipe a été prévenue.",
});

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
  paths: {
    '/api/impots/svair': <PathItemObject>{
      get: {
        summary: "Service de vérification de l'avis d'impôt sur le revenu",
        description:
          "Le service permet de vérifier l'authenticité du justificatif d'impôt sur le revenu ou de l'avis d'impôt sur le revenu présenté par un usager",
        parameters: [
          {
            name: 'numeroFiscal',
            in: 'query',
            description:
              'Numéro fiscal propre à chaque citoyen (identifiant numérique de 13 chiffres)',
            required: true,
            schema: {
              type: 'number',
              format: 'string',
            },
          },
          {
            name: 'referenceAvis',
            in: 'query',
            description:
              "Référence de l'avis fiscal (identifiant alphanumérique de 13 caractères). Attention, il est possible que l'utilisateur ajoute une quatorzième lettre à la fin de sa référence d'avis. Il s'agit d'une clé de vérification, il est nécessaire de l'enlever avant de l'envoyer sur l'API Particulier.",
            required: true,
            schema: {
              type: 'number',
              format: 'string',
            },
          },
        ],
        deprecated: true,
        tags: ['Impôts', 'DGFIP'],
        responses: {
          '401': unauthorizedResponse,
          '404': dgfipNotFoundError,
          '500': internalServerError,
          '502': invalidFormatError,
          '509': dgfipRateLimitedError,
          '503': networkError,
        },
      },
    },
  },
});
