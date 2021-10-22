import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {InvalidCredentialsError} from 'src/domain/data-fetching/data-providers/dgfip/errors/invalid-credentials.error';
import {RateLimitedError} from 'src/domain/data-fetching/data-providers/dgfip/errors/rate-limited.error';
import {NoEnrollmentError} from 'src/domain/data-fetching/data-providers/mesri/errors/no-enrollment.error';
import {NotFoundError as MesriNotFoundError} from 'src/domain/data-fetching/data-providers/mesri/errors/not-found.error';
import {NotFoundError as PoleEmploiNotFoundError} from 'src/domain/data-fetching/data-providers/pole-emploi/errors/not-found.error';
import {ApplicationNotSubscribedError} from 'src/domain/data-fetching/errors/application-not-subscribed.error';
import {InvalidFormatError} from 'src/domain/data-fetching/errors/invalid-format.error';
import {NetworkError} from 'src/domain/data-fetching/errors/network.error';
import {TokenNotFoundError} from 'src/domain/data-fetching/errors/token-not-found.error';
import {TooManyCredentialsError} from 'src/domain/data-fetching/errors/too-many-credentials.error';
import {applicationNotSubsribedErrorPresenter} from 'src/presentation/presenters/error-presenters/application-not-subscribed.error-presenter';
import {cnafErrorPresenter} from 'src/presentation/presenters/error-presenters/cnaf.error-presenter';
import {invalidCredentialsErrorPresenter} from 'src/presentation/presenters/error-presenters/invalid-crendentials.error-presenter';
import {invalidFormatErrorPresenter} from 'src/presentation/presenters/error-presenters/invalid-format.error-presenter';
import {mesriErrorPresenter} from 'src/presentation/presenters/error-presenters/mesri.error-presenter';
import {networkErrorPresenter} from 'src/presentation/presenters/error-presenters/network.error-presenter';
import {poleEmploiErrorPresenter} from 'src/presentation/presenters/error-presenters/pole-emploi.error-presenter';
import {rateLimitedErrorPresenter} from 'src/presentation/presenters/error-presenters/rate-limited.error-presenter';
import {serverErrorPresenter} from 'src/presentation/presenters/error-presenters/server.error-presenter';
import {tokenNotFoundErrorPresenter} from 'src/presentation/presenters/error-presenters/token-not-found.error-presenter';
import {tooManyCredentialsErrorPresenter} from 'src/presentation/presenters/error-presenters/too-many-credentials.error-presenter';
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
    case TooManyCredentialsError:
      return tooManyCredentialsErrorPresenter(error as TooManyCredentialsError);
    case ZodError:
      return zodErrorPresenter(error as ZodError);
    case MesriNotFoundError:
    case NoEnrollmentError:
      return mesriErrorPresenter(error);
    case PoleEmploiNotFoundError:
      return poleEmploiErrorPresenter(error);
    default:
      return serverErrorPresenter(error);
  }
};
