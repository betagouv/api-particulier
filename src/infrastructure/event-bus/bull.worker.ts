import {Worker} from 'bullmq';
import {Redis} from 'ioredis';
import {Event} from 'src/domain/event';
import {
  applicationEventQueueName,
  tokenEventQueueName,
} from 'src/infrastructure/event-bus/bull.event-bus';

export class BullWorker {
  private readonly applicationEventWorker: Worker;
  private readonly tokenEventWorker: Worker;

  constructor(
    connection: Redis,
    eventHandlers: {
      [eventName: string]: ((event: Event) => void)[];
    }
  ) {
    this.applicationEventWorker = new Worker(
      applicationEventQueueName,
      async job => {
        if (eventHandlers[job.name]) {
          eventHandlers[job.name].forEach(handler => handler(job.data));
        }
      },
      {connection}
    );
    this.tokenEventWorker = new Worker(
      tokenEventQueueName,
      async job => {
        if (eventHandlers[job.name]) {
          eventHandlers[job.name].forEach(handler => handler(job.data));
        }
      },
      {connection}
    );
  }

  async close() {
    await this.applicationEventWorker.close();
    await this.tokenEventWorker.close();
  }
}
