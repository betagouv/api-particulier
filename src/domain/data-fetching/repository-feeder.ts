import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor, Logger} from 'src/domain/logger';

export class RepositoryFeeder {
  private readonly logger: Logger = logFor(RepositoryFeeder.name);

  constructor(
    private readonly mainRepository: TokenRepository,
    private readonly fallbackRepository: TokenRepository
  ) {}

  async onTokenNotFound(event: TokenNotFound) {
    try {
      const token = await this.fallbackRepository.findByTokenValue(
        event.tokenValue
      );
      this.logger.log(
        'info',
        `Token "${token.value}" was found through fallback`
      );
      this.mainRepository.save(token);
    } catch (error) {
      if (!(error instanceof TokenNotFoundError)) {
        throw error;
      }
    }
  }
}
