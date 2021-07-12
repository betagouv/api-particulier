import {Queue} from 'bullmq';
import * as IORedis from 'ioredis';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

export const applicationEventQueue = new Queue('Application events', {
  connection: redisConnection,
});
export const tokenEventQueue = new Queue('Token events', {
  connection: redisConnection,
});

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
