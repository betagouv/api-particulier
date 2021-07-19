import {Worker} from 'bullmq';
import {Redis} from 'ioredis';
import {Event} from 'src/domain/event';
import {logFor} from 'src/domain/logger';
import {
  applicationEventQueueName,
  tokenEventQueueName,
} from 'src/infrastructure/event-bus/bull.event-bus';

export class BullWorker {
  private readonly applicationEventWorker: Worker;
  private readonly tokenEventWorker: Worker;
  private readonly logger = logFor(BullWorker.name);

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
    this.attachListenersToWorker(this.applicationEventWorker);
    this.attachListenersToWorker(this.tokenEventWorker);
  }

  private attachListenersToWorker(worker: Worker) {
    worker.on('completed', job => {
      this.logger.log(
        'debug',
        `Job "${job.name}" on queue "${job.queueName}" completed`,
        {job: job.toJSON()}
      );
    });
    worker.on('failed', job => {
      this.logger.log(
        'error',
        `Job "${job.name}" on queue "${job.queueName}" failed`,
        {job: job.toJSON()}
      );
    });
  }

  async close() {
    await this.applicationEventWorker.close();
    await this.tokenEventWorker.close();
  }
}
