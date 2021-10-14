import {ApplicationRepository} from 'src/domain/application-management/repositories/application-entity.repository';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {TokenValue} from 'src/domain/token-value';

export class IntrospectUsecase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly tokenCache: TokenCache
  ) {}

  async introspectToken(tokenValue: TokenValue) {
    // Use a token repository to benefit from hash retry strategy
    const token = await this.tokenCache.findByTokenValue(tokenValue);

    const application = await this.applicationRepository.findByTokenValue(
      token.value
    );
    return application;
  }
}
