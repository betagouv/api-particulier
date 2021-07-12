import {Worker} from 'bullmq';
import {Event} from 'src/domain/event';
import {
  applicationEventQueue,
  tokenEventQueue,
} from 'src/infrastructure/event-bus/bull.event-bus';

export class BullWorker {
  private readonly applicationWorker: Worker;
  private readonly tokenWorker: Worker;

  constructor(eventHandlers: {
    [eventName: string]: ((event: Event) => void)[];
  }) {
    this.applicationWorker = new Worker(
      applicationEventQueue.name,
      async job => {
        if (eventHandlers[job.name]) {
          eventHandlers[job.name].forEach(handler => handler(job.data));
        }
      }
    );
    this.tokenWorker = new Worker(tokenEventQueue.name, async job => {
      if (eventHandlers[job.name]) {
        eventHandlers[job.name].forEach(handler => handler(job.data));
      }
    });
  }

  async close() {
    await this.applicationWorker.close();
    await this.tokenWorker.close();
  }
}
