import * as Redis from 'ioredis';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class RedisTokenRepository implements TokenRepository {
  constructor(private readonly connection: Redis.Redis) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    const stringifiedToken = await this.connection.get(
      this.getTokenValueKey(tokenValue)
    );

    if (stringifiedToken === null) {
      throw new TokenNotFoundError(tokenValue);
    }

    return JSON.parse(stringifiedToken);
  }

  async save(token: Token): Promise<void> {
    const key = this.getTokenValueKey(token.value);
    await this.connection.set(key, JSON.stringify(token));
  }

  private getTokenValueKey(tokenValue: TokenValue): string {
    return 'TOKEN_VALUE-' + tokenValue;
  }
}
