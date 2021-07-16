import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {Token} from 'src/domain/data-fetching/projections/token';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';

export class TokenProjector {
  constructor(private readonly tokenRepository: TokenRepository) {}

  onApplicationCreated(event: ApplicationCreated): void {
    this.createTokenFromEvent(event);
  }

  onApplicationImported(event: ApplicationImported): void {
    this.createTokenFromEvent(event);
  }

  private createTokenFromEvent(
    event: ApplicationCreated | ApplicationImported
  ) {
    const newToken = new Token(
      event.aggregateId as ApplicationId,
      event.tokenValue,
      event.scopes,
      event.subscriptions
    );

    this.tokenRepository.save(newToken);
  }
}
