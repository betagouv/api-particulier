import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/gateway/events/application-created.event';
import {Token} from 'src/domain/gateway/projections/token';
import {TokenRepository} from 'src/domain/gateway/repositories/token.repository';

export class TokenProjector {
  constructor(private readonly tokenRepository: TokenRepository) {}

  onApplicationCreated(event: ApplicationCreated): void {
    const newToken = new Token(
      event.aggregateId as ApplicationId,
      event.tokenValue,
      event.scopes,
      event.subscriptions
    );

    this.tokenRepository.save(newToken);
  }
}
