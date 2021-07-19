import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {logFor, Logger} from 'src/domain/logger';

export class TokenProjector {
  private readonly logger: Logger;

  constructor(private readonly tokenRepository: TokenRepository) {
    this.logger = logFor(
      `${TokenProjector.name}/${tokenRepository.constructor.name}`
    );
  }

  async onApplicationCreated(event: ApplicationCreated): Promise<void> {
    await this.createTokenFromEvent(event);
  }

  async onApplicationImported(event: ApplicationImported): Promise<void> {
    await this.createTokenFromEvent(event);
  }

  private async createTokenFromEvent(
    event: ApplicationCreated | ApplicationImported
  ) {
    const newToken = new Token(
      event.aggregateId as ApplicationId,
      event.tokenValue,
      event.scopes,
      event.subscriptions
    );

    await this.tokenRepository.save(newToken);
    this.logger.log('debug', 'Projected token from event', {event});
  }
}
