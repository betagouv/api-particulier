import {Event} from 'src/domain/event';

export interface EventStore {
  append(event: Event): Promise<void>;
}
