import {CnafError} from 'src/domain/data-fetching/data-providers/cnaf/errors/cnaf.error';
import {cnafDataPresenter} from 'src/infrastructure/service-container';
import {ErrorPresenter} from 'src/presentation/presenters/error-presenters/error-presenter';

export const cnafErrorPresenter: ErrorPresenter<CnafError> = (
  error: CnafError
) => {
  return cnafDataPresenter.presentError(error);
};
