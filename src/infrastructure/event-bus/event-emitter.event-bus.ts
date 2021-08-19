import {EventEmitter} from 'events';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {EventBus2} from 'src/domain/event-bus';

export class EventEmitterEventBus implements EventBus2 {
  private readonly eventEmitter = new EventEmitter();

  publish(event: Event): void {
    this.eventEmitter.emit(event.constructor.name, event);
  }

  onApplicationCreated(handler: (event: ApplicationCreated) => Promise<void>) {
    this.eventEmitter.addListener(ApplicationCreated.name, handler);
  }

  onApplicationImported(
    handler: (event: ApplicationImported) => Promise<void>
  ) {
    this.eventEmitter.addListener(ApplicationImported.name, handler);
  }

  onUserSubscribed(handler: (event: UserSubscribed) => Promise<void>): void {
    this.eventEmitter.addListener(UserSubscribed.name, handler);
  }

  onTokenConsumed(handler: (event: TokenConsumed) => Promise<void>): void {
    this.eventEmitter.addListener(TokenConsumed.name, handler);
  }

  onTokenNotFound(handler: (event: TokenNotFound) => Promise<void>): void {
    this.eventEmitter.addListener(TokenNotFound.name, handler);
  }
}
