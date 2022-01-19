import {setUser} from '@sentry/node';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {MesriInput} from 'src/domain/data-fetching/data-providers/mesri/dto';
import {FranceConnectClient} from 'src/domain/data-fetching/france-connect.client';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';

export class FetchDataWithFranceConnectUsecase {
  constructor(
    private readonly franceConnectClient: FranceConnectClient,
    private readonly dataProviderClient: DataProviderClient
  ) {}

  async fetchMesriData(
    accessToken: TokenValue,
    setCurrentToken: (token: Token) => void,
    setInputData: (inputData: unknown) => void
  ) {
    const {identity, token} =
      await this.franceConnectClient.getTokenAndIdentityFromAccessToken(
        accessToken
      );
    setUser({id: token.application.id});
    setCurrentToken(token);
    setInputData(identity);

    const mesriInput: MesriInput = {
      dateNaissance: new Date(identity.birthdate),
      nomFamille: identity.family_name,
      prenom: identity.given_name,
      sexe: identity.gender === 'female' ? '2' : '1',
      lieuNaissance: identity.birthplace,
    };
    return this.dataProviderClient.consumeMesri(mesriInput, token);
  }
}
