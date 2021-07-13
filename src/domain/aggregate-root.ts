import {Event} from 'src/domain/event';

export class AggregateRoot {
  private events: Event[] = [];

  static fromEvents(events: Event[]) {
    const self = new this();
    events.forEach(event => {
      self.apply(event);
    });

    return self;
  }

  getPendingEvents(): Event[] {
    return this.events;
  }

  protected raiseAndApply(event: Event) {
    this.events.push(event);
    this.apply(event);
  }

  private apply(event: Event) {
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
