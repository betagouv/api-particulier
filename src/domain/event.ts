export abstract class Event {
  constructor(readonly aggregateId: string, readonly payload: object) {}
}
