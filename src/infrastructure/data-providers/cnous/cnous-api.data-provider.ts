import axios, {AxiosInstance} from 'axios';
import tokenProvider from 'axios-token-interceptor';
import {stringify} from 'qs';
import jwtDecode from 'jwt-decode';
import {CnousDataProvider} from 'src/domain/data-fetching/data-providers/cnous/data-provider';
import {
  CnousInput,
  CnousOutput,
  isFranceConnectIdentityInput,
  isIneInput,
} from 'src/domain/data-fetching/data-providers/cnous/dto';
import {transformError} from 'src/infrastructure/data-providers/error-transformer';
import {parseDate} from 'src/infrastructure/data-providers/parsers';
import {NotFoundError} from 'src/domain/data-fetching/data-providers/cnous/errors/not-found.error';
import {format} from 'date-fns';

export class CnousApiDataProvider implements CnousDataProvider {
  private readonly axios: AxiosInstance;

  constructor() {
    const tokenCache = tokenProvider.tokenCache(
      async () => {
        const tokenResponse = await axios.post(
          process.env.CNOUS_TOKEN_URL!,
          stringify({
            grant_type: 'client_credentials',
            env: process.env.CNOUS_ENV,
          }),
          {
            auth: {
              username: process.env.CNOUS_CLIENT_ID!,
              password: process.env.CNOUS_CLIENT_SECRET!,
            },
          }
        );
        return tokenResponse.headers.authorization.replace('Bearer ', '');
      },
      {
        getMaxAge: token => {
          const jwt = jwtDecode(token) as {exp: number; iat: number};
          return jwt.exp * 1000 - new Date().getTime() - 60 * 1000;
        },
      }
    );
    this.axios = axios.create({timeout: 10000});
    this.axios.interceptors.request.use(
      tokenProvider({
        getToken: tokenCache,
      })
    );
  }

  async fetch(input: CnousInput): Promise<CnousOutput> {
    try {
      let data;
      if (isIneInput(input)) {
        const response = await this.axios.get(
          `${process.env.CNOUS_API_URL}/v1/boursier/${input.ine}`
        );
        data = response.data;
      } else if (isFranceConnectIdentityInput(input)) {
        const response = await this.axios.get(
          `${process.env.CNOUS_API_URL}/v1/boursier/find`,
          {
            params: input,
          }
        );
        data = response.data;
      } else {
        const response = await this.axios.post(
          `${process.env.CNOUS_API_URL}/v1/boursier/donnees-pivots`,
          {
            lastName: input.nom,
            firstNames: input.prenoms.join(', '),
            birthDate: format(input.dateNaissance, 'dd/MM/yyyy'),
            birthPlace: input.lieuNaissance,
            civility: input.sexe,
          }
        );
        data = response.data;
      }

      return {
        ine: data.ine,
        nom: data.lastName,
        prenom: data.firstName,
        prenom2: data.firstName2,
        sexe: data.civility,
        dateNaissance: parseDate(data.birthDate),
        lieuNaissance: data.birthPlace?.libelle ?? data.birthPlaceLibelle,
        boursier: data.boursier,
        echelonBourse: data.grantEchelon,
        email: data.email,
        dateDeRentree: parseDate(data.backToSchoolDate),
        dureeVersement: data.paymentDuration,
        statut: data.grantStatus,
        statutLibelle:
          data.grantStatus === 0 ? 'définitif' : 'provisoire (conditionnel)',
        villeEtudes: data.studyTown,
        etablissement: data.schoolName,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError();
      }
      throw transformError(error);
    }
  }
}
