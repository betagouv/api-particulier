import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';
import {TokenValue} from 'src/domain/token-value';

export class IntrospectUsecase {
  constructor(
    private readonly applicationProjectionRepository: ApplicationProjectionRepository
  ) {}

  async introspectToken(tokenValue: TokenValue) {
    return this.applicationProjectionRepository.findByTokenValue(tokenValue);
  }
}
