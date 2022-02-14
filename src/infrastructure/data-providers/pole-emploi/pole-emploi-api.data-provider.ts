import axios, {AxiosInstance} from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import {PoleEmploiDataProvider} from 'src/domain/data-fetching/data-providers/pole-emploi/data-provider';
import {
  PoleEmploiInput,
  PoleEmploiMetadata,
  PoleEmploiOutput,
} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/pole-emploi/errors/not-found.error';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';
import {parseDate} from 'src/infrastructure/data-providers/parsers';

export class PoleEmploiApiDataProvider implements PoleEmploiDataProvider {
  private readonly axios: AxiosInstance;

  constructor() {
    const getClientCredentials = oauth.client(axios.create(), {
      url: process.env.POLE_EMPLOI_TOKEN_URL,
      grant_type: 'client_credentials',
      client_id: process.env.POLE_EMPLOI_CLIENT_ID,
      client_secret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      scope: process.env.POLE_EMPLOI_SCOPES,
    });

    this.axios = axios.create();
    this.axios.interceptors.request.use(
      oauth.interceptor(tokenProvider, getClientCredentials)
    );
  }

  async fetch(
    input: PoleEmploiInput,
    metadata: PoleEmploiMetadata
  ): Promise<PoleEmploiOutput> {
    try {
      const response = await this.axios.post(
        process.env.POLE_EMPLOI_API_URL!,
        input.id,
        {
          headers: {
            'X-pe-consommateur':
              metadata.caller.id + ' - ' + metadata.caller.name,
          },
          timeout: 10000,
        }
      );

      const {data} = response;

      return {
        identifiant: input.id,
        civilite: data.civilite,
        nom: data.nom,
        nomUsage: data.nomUsage,
        prenom: data.prenom,
        sexe: data.sexe,
        dateNaissance: data.dateNaissance
          ? parseDate(data.dateNaissance)
          : undefined,
        codeCertificationCNAV: data.codeCertificationCNAV,
        telephone: data.telephone,
        telephone2: data.telephone2,
        email: data.email,
        adresse: data.adresse,
        dateInscription: data.dateInscription
          ? parseDate(data.dateInscription)
          : undefined,
        dateCessationInscription: data.dateCessationInscription
          ? parseDate(data.dateCessationInscription)
          : undefined,
        codeCategorieInscription: data.categorieInscription
          ? parseInt(data.categorieInscription)
          : undefined,
        libelleCategorieInscription: data.libellecategorieInscription,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError(input.id);
      }
      throw transformError(error);
    }
  }
}
