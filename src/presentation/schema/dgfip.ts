import {PathsObject, SchemaObject} from 'openapi3-ts';
import {
  dgfipNotFoundError,
  dgfipRateLimitedError,
  internalServerError,
  invalidFormatError,
  networkError,
  unauthorizedResponse,
} from 'src/presentation/schema/errors';

const declarantSchema: SchemaObject = {
  type: 'object',
  properties: {
    nom: {
      type: 'string',
      description: 'Nom du déclarant',
    },
    nomNaissance: {
      type: 'string',
      description: 'Nom de naissance du déclarant',
    },
    prenoms: {
      type: 'string',
      description: 'Prénoms du déclarant',
    },
  },
};

const dateSchema: SchemaObject = {
  type: 'string',
  pattern: '^\\d{2}/\\d{2}/\\d{4}$',
  example: '03/05/1991',
};

const yearSchema: SchemaObject = {
  type: 'string',
  pattern: '^\\d{4}$',
  example: '2021',
};

export const dgfipPaths = <PathsObject>{
  '/api/impots/svair': {
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
        '200': {
          description: "Avis d'imposition",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  declarant1: declarantSchema,
                  declarant2: declarantSchema,
                  dateRecouvrement: dateSchema,
                  dateEtablissement: dateSchema,
                  nombreParts: {
                    type: 'number',
                  },
                  situationFamille: {type: 'string'},
                  revenuBrutGlobal: {type: 'number'},
                  revenuImposable: {type: 'number'},
                  impotRevenuNetAvantCorrections: {type: 'number'},
                  montantImpot: {type: 'number'},
                  revenuFiscalReference: {type: 'number'},
                  nombrePersonnesCharge: {type: 'integer'},
                  anneeImpots: yearSchema,
                  anneeRevenus: yearSchema,
                  erreurCorrectif: {
                    type: 'string',
                    description:
                      "S'il existe un correctif plus récent que l'avis contrôlé, ce champ prend la valeur \"Ce document ne correspond pas à la situation la plus récente pour cet usager\". Sinon, le champ est absent de la réponse. La présence de ce champ indique qu'il existe un avis d'imposition avec un numéro d'avis distinct qui contient les informations plus récentes. La mise à jour de l'avis initial est en général à l'initiative de l'administré auprès des impôts (par exemple : changement de revenus ou du nombre de part). L'API Particulier peut fournir cet avis à condition de connaître le numéro de l'avis le plus récent. L'API Particulier ne peut pas fournir le numéro de l'avis le plus récent en réponse de l'appel initial. Pour trouver le numéro de cet avis, il faut le demander au particulier auquel l'avis est adressé ou le demander manuellement auprès du centre des impôts de votre région. Vous trouverez de plus amples informations sur <a href=\"https://www.impots.gouv.fr/portail/precisions-sur-le-service-de-verification-des-avis-dimpot-sur-le-revenu-svair\">le site des impôts</a>.",
                  },
                  situationPartielle: {
                    type: 'string',
                    description:
                      'Le champ "situationPartielle" indique, dans un foyer marié ou pacsé, le décès d\'un des contribuables. Cela signifie qu\'il y aura 2 avis de taxations pour une même année : une taxation pour le couple du 01/01/AAAA à la date du décès d\'un déclarant, et une autre taxation, pour le conjoint survivant, de la date de décès du conjoint au 31/12/AAAA. Ce champ prend la valeur "(*) Situation  {anneeRevenus} partielle". Sinon, le champ est absent de la réponse.',
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '404': dgfipNotFoundError,
        '500': internalServerError,
        '502': invalidFormatError,
        '509': dgfipRateLimitedError,
        '503': networkError,
      },
    },
  },
  '/api/v2/avis-imposition': {
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
      tags: ['Impôts', 'DGFIP'],
      responses: {
        '200': {
          description: "Avis d'imposition",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  declarant1: declarantSchema,
                  declarant2: declarantSchema,
                  dateRecouvrement: dateSchema,
                  dateEtablissement: dateSchema,
                  nombreParts: {
                    type: 'number',
                  },
                  situationFamille: {type: 'string'},
                  revenuBrutGlobal: {type: 'number', nullable: true},
                  revenuImposable: {type: 'number', nullable: true},
                  impotRevenuNetAvantCorrections: {
                    type: 'number',
                    nullable: true,
                  },
                  montantImpot: {type: 'number', nullable: true},
                  revenuFiscalReference: {type: 'number', nullable: true},
                  nombrePersonnesCharge: {type: 'integer'},
                  anneeImpots: yearSchema,
                  anneeRevenus: yearSchema,
                  erreurCorrectif: {
                    type: 'string',
                    description:
                      "S'il existe un correctif plus récent que l'avis contrôlé, ce champ prend la valeur \"Ce document ne correspond pas à la situation la plus récente pour cet usager\". Sinon, le champ est absent de la réponse. La présence de ce champ indique qu'il existe un avis d'imposition avec un numéro d'avis distinct qui contient les informations plus récentes. La mise à jour de l'avis initial est en général à l'initiative de l'administré auprès des impôts (par exemple : changement de revenus ou du nombre de part). L'API Particulier peut fournir cet avis à condition de connaître le numéro de l'avis le plus récent. L'API Particulier ne peut pas fournir le numéro de l'avis le plus récent en réponse de l'appel initial. Pour trouver le numéro de cet avis, il faut le demander au particulier auquel l'avis est adressé ou le demander manuellement auprès du centre des impôts de votre région. Vous trouverez de plus amples informations sur <a href=\"https://www.impots.gouv.fr/portail/precisions-sur-le-service-de-verification-des-avis-dimpot-sur-le-revenu-svair\">le site des impôts</a>.",
                  },
                  situationPartielle: {
                    type: 'string',
                    description:
                      'Le champ "situationPartielle" indique, dans un foyer marié ou pacsé, le décès d\'un des contribuables. Cela signifie qu\'il y aura 2 avis de taxations pour une même année : une taxation pour le couple du 01/01/AAAA à la date du décès d\'un déclarant, et une autre taxation, pour le conjoint survivant, de la date de décès du conjoint au 31/12/AAAA. Ce champ prend la valeur "(*) Situation  {anneeRevenus} partielle". Sinon, le champ est absent de la réponse.',
                  },
                },
              },
            },
          },
        },
        '401': unauthorizedResponse,
        '404': dgfipNotFoundError,
        '500': internalServerError,
        '502': invalidFormatError,
        '509': dgfipRateLimitedError,
        '503': networkError,
      },
    },
  },
};
