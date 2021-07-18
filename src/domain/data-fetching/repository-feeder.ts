import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';

export class RepositoryFeeder {
  constructor(
    private readonly mainRepository: TokenRepository,
    private readonly fallbackRepository: TokenRepository
  ) {}

  async onTokenNotFound(event: TokenNotFound) {
    try {
      const token = await this.fallbackRepository.findByTokenValue(
        event.tokenValue
      );
      this.mainRepository.save(token);
    } catch (error) {
      if (!(error instanceof TokenNotFoundError)) {
        throw error;
      }
    }
  }
}
