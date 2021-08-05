import {RateLimitedError} from 'src/domain/data-fetching/data-providers/dgfip/errors/rate-limited.error';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const rateLimitedErrorPresenter: ErrorPresenter<RateLimitedError> = (
  error: RateLimitedError
) => {
  return {
    statusCode: 509,
    error: 'rate_limited',
    reason: error.message,
    message:
      "Le fournisseur de donnée a rejeté la demande en raison d'un trop grand nombre d'échecs antérieurs.",
  };
};
