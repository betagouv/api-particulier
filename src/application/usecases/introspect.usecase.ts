import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {TokenValue} from 'src/domain/token-value';

export class IntrospectUsecase {
  constructor(
    private readonly applicationProjectionRepository: ApplicationProjectionRepository,
    private readonly tokenCache: TokenCache
  ) {}

  async introspectToken(tokenValue: TokenValue) {
    // Use a token repository to benefit from hash retry strategy
    const token = await this.tokenCache.findByTokenValue(tokenValue);

    const applicationProjection =
      await this.applicationProjectionRepository.findByTokenValue(token.value);
    return applicationProjection;
  }
}
