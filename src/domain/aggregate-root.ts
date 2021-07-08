import {Event} from 'src/domain/event';

export class AggregateRoot<E extends Event> {
  private events: E[] = [];

  static fromEvents<E extends Event>(events: E[]) {
    const self = new this();
    events.forEach(event => {
      self.apply(event);
    });

    return self;
  }

  getPendingEvents(): E[] {
    return this.events;
  }

  protected raiseAndApply(event: E) {
    this.events.push(event);
    this.apply(event);
  }

  private apply(event: E) {
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
