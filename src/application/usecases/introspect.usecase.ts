import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {TokenValue} from 'src/domain/token-value';

export class IntrospectUsecase {
  constructor(
    private readonly applicationProjectionRepository: ApplicationProjectionRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  async introspectToken(tokenValue: TokenValue) {
    // Use a token repository to benefit from hash retry strategy
    const token = await this.tokenRepository.findByTokenValue(tokenValue);

    const applicationProjection =
      await this.applicationProjectionRepository.findByTokenValue(token.value);
    return applicationProjection;
  }
}
