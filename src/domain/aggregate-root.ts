import {AggregateEvent} from 'src/domain/aggregate-event';

export class AggregateRoot {
  private events: AggregateEvent[] = [];

  static fromEvents(events: AggregateEvent[]) {
    const self = new this();
    events.forEach(event => {
      self.apply(event);
    });

    return self;
  }

  getPendingEvents(): AggregateEvent[] {
    return this.events;
  }

  protected raiseAndApply(event: AggregateEvent) {
    this.events.push(event);
    this.apply(event);
  }

  private apply(event: AggregateEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!this[`apply${event.constructor.name}`]) {
      throw new Error(
        `No handler found for ${event.constructor.name}. Be sure to define a method called apply${event.constructor.name} on the aggregate.`
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[`apply${event.constructor.name}`](event);
  }
}
