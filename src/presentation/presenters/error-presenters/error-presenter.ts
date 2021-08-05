import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {RateLimitedError} from 'src/domain/data-fetching/data-providers/dgfip/errors/rate-limited.error';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {InvalidFormatError} from 'src/domain/data-fetching/errors/invalid-format.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {applicationNotSubsribedErrorPresenter} from 'src/presentation/presenters/error-presenters/application-not-subscribed.error-presenter';
import {cnafErrorPresenter} from 'src/presentation/presenters/error-presenters/cnaf.error-presenter';
import {invalidCredentialsErrorPresenter} from 'src/presentation/presenters/error-presenters/invalid-crendentials.error-presenter';
import {invalidFormatErrorPresenter} from 'src/presentation/presenters/error-presenters/invalid-format.error-presenter';
import {networkErrorPresenter} from 'src/presentation/presenters/error-presenters/network.error-presenter';
import {rateLimitedErrorPresenter} from 'src/presentation/presenters/error-presenters/rate-limited.error-presenter';
import {serverErrorPresenter} from 'src/presentation/presenters/error-presenters/server.error-presenter';
import {tokenNotFoundErrorPresenter} from 'src/presentation/presenters/error-presenters/token-not-found.error-presenter';
import {zodErrorPresenter} from 'src/presentation/presenters/error-presenters/zod.error-presenter';
import {ZodError} from 'zod';

export type ErrorPresenter<E extends Error> = (error: E) => {
  statusCode: number;
  error?: string;
  reason?: string;
  message?: string;
};

export const errorPresenter: ErrorPresenter<Error> = (error: Error) => {
  switch (error.constructor) {
    case ApplicationNotSubscribedError:
      return applicationNotSubsribedErrorPresenter(error);
    case CnafError:
      return cnafErrorPresenter(error as CnafError);
    case InvalidCredentialsError:
      return invalidCredentialsErrorPresenter(error);
    case InvalidFormatError:
      return invalidFormatErrorPresenter(error);
    case NetworkError:
      return networkErrorPresenter(error);
    case RateLimitedError:
      return rateLimitedErrorPresenter(error);
    case TokenNotFoundError:
      return tokenNotFoundErrorPresenter(error as TokenNotFoundError);
    case ZodError:
      return zodErrorPresenter(error as ZodError);
    default:
      return serverErrorPresenter(error);
  }
};
