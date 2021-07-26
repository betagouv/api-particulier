import {setUser} from '@sentry/node';
import * as Redis from 'ioredis';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor} from 'src/domain/logger';
import {TokenValue} from 'src/domain/token-value';

export class RedisTokenRepository implements TokenRepository {
  private readonly logger = logFor(RedisTokenRepository.name);

  constructor(private readonly connection: Redis.Redis) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    this.logger.log('debug', `Finding token "${tokenValue}"`);
    const stringifiedToken = await this.connection.get(
      this.getTokenValueKey(tokenValue)
    );

    if (stringifiedToken === null) {
      throw new TokenNotFoundError(tokenValue);
    }

    const token = JSON.parse(stringifiedToken);
    this.logger.log('debug', `Found token for value "${tokenValue}"`, {token});

    setUser({id: token.applicationId});
    return token;
  }

  async save(token: Token): Promise<void> {
    this.logger.log('debug', `Saving token "${token.value}"`, {token});
    const key = this.getTokenValueKey(token.value);
    await this.connection.set(key, JSON.stringify(token));
  }

  private getTokenValueKey(tokenValue: TokenValue): string {
    return 'TOKEN_VALUE-' + tokenValue;
  }
}
