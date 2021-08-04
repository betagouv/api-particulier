import {Event} from 'src/domain/event';

export interface EventBus {
  publish(event: Event): Promise<void>;
}
