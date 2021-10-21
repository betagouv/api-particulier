import axios from 'axios';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {TokenValue} from 'src/domain/token-value';

export type FranceConnectIdentity = {
  given_name: string;
  family_name: string;
  birthdate: string;
  gender: string;
  birthplace: string;
  birthcountry: string;
  preferred_username?: string;
  email?: string;
  address?: {
    country: string;
    formatted: string;
    locality: string;
    postal_code: string;
    street_address: string;
  };
  phone_number?: string;
};

type CheckTokenResponse = {
  scope: string[];
  identity: FranceConnectIdentity;
  client: {
    client_id: TokenValue;
    name: string;
  };
};

export class FranceConnectClient {
  constructor(private readonly tokenCache: TokenCache) {}

  async getTokenAndIdentityFromAccessToken(
    accessToken: TokenValue
  ): Promise<{token: Token; identity: FranceConnectIdentity}> {
    const {
      data: {identity, client},
    } = await axios.post<CheckTokenResponse>(
      process.env.FRANCE_CONNECT_CHECK_TOKEN_URL!,
      {
        token: accessToken,
      }
    );

    const candidateToken = await this.tokenCache.findByTokenValue(
      client.client_id
    );

    return {
      token: candidateToken,
      identity,
    };
  }
}
