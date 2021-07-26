import {Job, Worker} from 'bullmq';
import {Redis} from 'ioredis';
import {Event} from 'src/domain/event';
import {logFor} from 'src/domain/logger';
import {
  applicationEventQueueName,
  tokenEventQueueName,
} from 'src/infrastructure/event-bus/bull.event-bus';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.ENV,
  maxValueLength: 2000,
});

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
    const jobHandler = async (job: Job) => {
      if (eventHandlers[job.name]) {
        const transaction = Sentry.startTransaction({
          name: job.name,
          op: job.id,
          data: job.toJSON(),
          traceId: job.data.traceId,
        });
        try {
          return await Promise.all(
            eventHandlers[job.name].map(handler => handler(job.data))
          );
        } catch (error) {
          Sentry.captureException(error);
        } finally {
          transaction.finish();
        }
      }
      return;
    };
    this.applicationEventWorker = new Worker(
      applicationEventQueueName,
      jobHandler,
      {connection}
    );
    this.tokenEventWorker = new Worker(tokenEventQueueName, jobHandler, {
      connection,
    });
    this.attachListenersToWorker(this.applicationEventWorker);
    this.attachListenersToWorker(this.tokenEventWorker);

    this.logger.log('info', 'Bull worker started!');
  }

  private attachListenersToWorker(worker: Worker) {
    worker.on('completed', job => {
      this.logger.log(
        'debug',
        `Job "${job.name}" on queue "${job.queueName}" completed`
      );
    });
    worker.on('failed', job => {
      this.logger.log(
        'error',
        `Job "${job.name}" on queue "${job.queueName}" failed`,
        {job}
      );
    });
    worker.on('error', error => {
      Sentry.captureException(error);
      this.logger.log('error', `Worker failed on queue ${worker.name}`, {
        error,
      });
    });
  }

  async close() {
    await this.applicationEventWorker.close();
    await this.tokenEventWorker.close();
  }
}
