import {EventEmitter} from 'events';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationRemoved} from 'src/domain/application-management/events/application-removed.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';

export class EventEmitterEventBus implements EventBus {
  private readonly eventEmitter = new EventEmitter({captureRejections: true});

  constructor() {
    this.eventEmitter.on('error', console.log);
  }

  publish(event: Event): void {
    this.eventEmitter.emit(event.constructor.name, event);
  }

  onApplicationCreated(handler: (event: ApplicationCreated) => Promise<void>) {
    this.eventEmitter.addListener(ApplicationCreated.name, handler);
  }

  onApplicationRemoved(handler: (event: ApplicationRemoved) => Promise<void>) {
    this.eventEmitter.addListener(ApplicationRemoved.name, handler);
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
