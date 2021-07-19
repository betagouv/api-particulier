import * as _ from 'lodash';
import {logFor} from 'src/domain/logger';
import {DataProviderResponse} from '../data-providers/dto';

export type ScopesConfiguration<
  Scope extends string,
  T extends DataProviderResponse
> = Record<Scope, (keyof T)[]>;

export class PropertyBasedScopesFilter<
  Scope extends string,
  T extends DataProviderResponse
> {
  private readonly logger = logFor(PropertyBasedScopesFilter.name);

  constructor(
    private readonly scopesConfiguration: ScopesConfiguration<Scope, T>
  ) {}

  filter = (scopes: Scope[], response: Partial<T>): Partial<T> => {
    const maskedProperties: (keyof T)[] = _(
      scopes.map(scope => this.scopesConfiguration[scope])
    )
      .flattenDeep()
      .uniq()
      .value();
    const filteredResponse = Object.keys(response).reduce((result, key) => {
      if (!maskedProperties.includes(key as keyof T)) {
        return result;
      }
      return {...result, [key]: response[key as keyof T]};
    }, {} as T);

    this.logger.log('debug', 'Filtered response', {
      scopes,
      unfilteredResponse: response,
      filteredResponse,
    });

    return filteredResponse;
  };
}
