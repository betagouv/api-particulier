import {Application, Subscription} from '../application.aggregate';

export class ApplicationNotSubscribedError extends Error {
  constructor(application: Application, subscription: Subscription) {
    super(`${application.id} has not subscribed to ${subscription}`);
  }
}
