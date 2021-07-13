import * as crypto from 'crypto';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class TokenRepositoryWithHashRetry implements TokenRepository {
  constructor(private readonly decoratedRepository: TokenRepository) {}

  async findByTokenValue(tokenValue: TokenValue): Promise<Token> {
    try {
      const clearTokenValueCandidate =
        await this.decoratedRepository.findByTokenValue(tokenValue);
      return clearTokenValueCandidate;
    } catch (error) {
      if (error instanceof TokenNotFoundError) {
        return this.decoratedRepository.findByTokenValue(
          this.hashTokenValue(tokenValue)
        );
      }
      throw error;
    }
  }

  save(token: Token): Promise<void> {
    return this.decoratedRepository.save(token);
  }

  hashTokenValue(tokenValue: TokenValue): TokenValue {
    const hash = crypto.createHash('sha512');
    const hashedValue = hash.update(tokenValue);

    return hashedValue.digest('hex') as TokenValue;
  }
}
