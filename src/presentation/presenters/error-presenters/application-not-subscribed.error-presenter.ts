import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const applicationNotSubsribedErrorPresenter: ErrorPresenter<ApplicationNotSubscribedError> =
  () => {
    return {
      statusCode: 200,
    };
  };
