import {Queue} from 'bullmq';
import * as IORedis from 'ioredis';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';

export const applicationEventQueueName = 'Application events';
export const tokenEventQueueName = 'Token events';

export class BullEventBus implements EventBus {
  private readonly applicationEventQueue: Queue;
  private readonly tokenEventQueue: Queue;

  constructor(redisConnection: IORedis.Redis) {
    this.applicationEventQueue = new Queue(applicationEventQueueName, {
      connection: redisConnection,
    });
    this.tokenEventQueue = new Queue(applicationEventQueueName, {
      connection: redisConnection,
    });
  }

  publish(event: Event): void {
    switch (event.constructor) {
      case TokenConsumed:
        this.tokenEventQueue.add(event.constructor.name, event);
        break;
      default:
        this.applicationEventQueue.add(event.constructor.name, event);
        break;
    }
  }
}
