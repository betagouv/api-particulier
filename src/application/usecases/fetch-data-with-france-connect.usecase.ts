import {setUser} from '@sentry/node';
import {FranceConnectClient} from 'src/domain/data-fetching/france-connect.client';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenValue} from 'src/domain/token-value';

export class FetchDataWithFranceConnectUsecase {
  constructor(private readonly franceConnectClient: FranceConnectClient) {}

  async fetchMesriData(
    accessToken: TokenValue,
    setCurrentToken: (token: Token) => void
  ) {
    const {identity, token} =
      await this.franceConnectClient.getTokenAndIdentityFromAccessToken(
        accessToken
      );
    setUser({id: token.application.id});
    setCurrentToken(token);
  }
}
