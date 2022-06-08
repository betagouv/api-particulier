import {ResponseObject} from 'openapi3-ts';

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

export const unauthorizedResponse = errorResponseBuilder({
  error: 'access_denied',
  reason: 'Token not found or inactive',
  message: "Votre jeton d'API n'a pas été trouvé ou n'est pas actif",
});
export const dgfipRateLimitedError = errorResponseBuilder({
  error: 'rate_limited',
  reason: 'DGFIP error rate limit exceeded',
  message:
    "Le fournisseur de donnée a rejeté la demande en raison d'un trop grand nombre d'échecs antérieurs.",
});
export const dgfipNotFoundError = errorResponseBuilder({
  error: 'not_found',
  reason:
    'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
  message:
    'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis',
});
export const invalidFormatError = errorResponseBuilder({
  error: 'invalid_response',
  reason: 'Data provider returned an invalid data format.',
  message: 'La réponse du fournisseur de donnée est inexploitable',
});
export const networkError = errorResponseBuilder({
  error: 'network_error',
  reason: 'timeout of 10000 ms exceeded',
  message: "Une erreur est survenue lors de l'appel au fournisseur de donnée",
});
export const cafNotFoundError = errorResponseBuilder({
  error: 'not_found',
  reason: 'Dossier allocataire inexistant. Le document ne peut être édité.',
  message: 'Dossier allocataire inexistant. Le document ne peut être édité.',
});
export const cafError = errorResponseBuilder({
  error: 'data_provider_error',
  reason: 'Unknown error code 134',
  message: 'Erreur inconnue du fournisseur de donnée CAF',
});
export const poleEmploiNotFoundError = errorResponseBuilder({
  error: 'not_found',
  reason: 'Situation not found',
  message:
    "Aucune situation Pôle Emploi n'a pu être trouvée avec les critères de recherche fournis",
});
export const mesriNotFoundError = errorResponseBuilder({
  error: 'not_found',
  reason: 'Student not found',
  message:
    "Aucun étudiant n'a pu être trouvé avec les critères de recherche fournis",
});
export const internalServerError = errorResponseBuilder({
  error: 'error',
  reason: 'Internal server error',
  message: "Une erreur interne s'est produite, l'équipe a été prévenue.",
});
