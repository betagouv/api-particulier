import {memoize, MemoizedFunction} from 'lodash';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class TokenCache {
  readonly findByTokenValue: ((tokenValue: TokenValue) => Promise<Token>) &
    MemoizedFunction;

  constructor(tokenRepository: TokenRepository) {
    this.findByTokenValue = memoize(
      tokenRepository.findByTokenValue.bind(tokenRepository)
    );
  }

  clear() {
    this.findByTokenValue.cache.clear!();
  }
}
