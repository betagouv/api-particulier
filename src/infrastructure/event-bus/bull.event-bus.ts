import {Queue} from 'bullmq';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';

export const applicationEventQueue = new Queue('Application events');
export const tokenEventQueue = new Queue('Token events');

export class BullEventBus implements EventBus {
  publish(event: Event): void {
    switch (event.constructor) {
      case TokenConsumed:
        tokenEventQueue.add(event.constructor.name, event);
        break;
      default:
        applicationEventQueue.add(event.constructor.name, event);
        break;
    }
  }
}
