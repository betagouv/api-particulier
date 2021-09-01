import * as Redis from 'ioredis';
import {ApplicationId} from 'src/domain/application-id';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor} from 'src/domain/logger';
import {TokenValue} from 'src/domain/token-value';

const PREFIX = 'TOKEN_VALUE-';

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

    return token;
  }

  async save(token: Token): Promise<void> {
    this.logger.log('debug', `Saving token "${token.value}"`, {token});
    const key = this.getTokenValueKey(token.value);
    await this.connection.set(key, JSON.stringify(token));
  }

  async removeByApplicationId(id: ApplicationId): Promise<void> {
    const allKeys = await this.connection.keys(`${PREFIX}*`);

    const allTokens = await Promise.all(
      allKeys.map(async key => {
        const tokenValue = key.replace(PREFIX, '');
        const token = await this.findByTokenValue(<TokenValue>tokenValue);
        return token;
      })
    );

    const tokenToRemove = allTokens.find(token => token.applicationId === id);

    if (!tokenToRemove) {
      throw new Error(`No token found for application ${id}`);
    }

    await this.connection.del(this.getTokenValueKey(tokenToRemove.value));
  }

  private getTokenValueKey(tokenValue: TokenValue): string {
    return PREFIX + tokenValue;
  }
}
