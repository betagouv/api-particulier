import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {UserSubscribed} from 'src/domain/application-management/events/user-subscribed.event';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';

type Handler<T> = (event: T) => Promise<void>;

export interface EventBus {
  publish(event: Event): Promise<void>;
}

export interface EventBus2 {
  publish(event: Event): void;
  onApplicationCreated(handler: Handler<ApplicationCreated>): void;
  onApplicationImported(handler: Handler<ApplicationImported>): void;
  onUserSubscribed(handler: Handler<UserSubscribed>): void;
  onTokenConsumed(handler: Handler<TokenConsumed>): void;
  onTokenNotFound(handler: Handler<TokenNotFound>): void;
}
