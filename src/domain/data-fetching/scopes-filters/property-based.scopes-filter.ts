import * as _ from 'lodash';
import {pick} from 'lodash';
import {logFor} from 'src/domain/logger';
import {DataProviderResponse} from '../data-providers/dto';

export type ScopesConfiguration<Scope extends string> = Record<Scope, string[]>;

export class PropertyBasedScopesFilter<
  Scope extends string,
  T extends DataProviderResponse
> {
  private readonly logger = logFor(PropertyBasedScopesFilter.name);

  constructor(
    private readonly scopesConfiguration: ScopesConfiguration<Scope>
  ) {}

  filter = (scopes: Scope[], response: Partial<T>): Partial<T> => {
    const maskedProperties: string[] = _(
      scopes.map(scope => this.scopesConfiguration[scope])
    )
      .flattenDeep()
      .uniq()
      .value();

    const filteredResponse = pick(response, maskedProperties);

    this.logger.log('debug', 'Filtered response', {
      scopes,
      unfilteredResponse: response,
      filteredResponse,
    });

    return filteredResponse;
  };
}
