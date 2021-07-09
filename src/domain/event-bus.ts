import {Event} from 'src/domain/event';

export interface EventBus {
  publish(event: Event): void;
  registerEventListener(event: Event, listener: (event: Event) => void): void;
}
