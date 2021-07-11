import * as _ from 'lodash';
import {DataProviderResponse} from '../data-providers/dto';

export type ScopesConfiguration<
  Scope extends string,
  T extends DataProviderResponse
> = Record<Scope, (keyof T)[]>;

export class PropertyBasedScopesFilter<
  Scope extends string,
  T extends DataProviderResponse
> {
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
    return Object.keys(response).reduce((result, key) => {
      if (!maskedProperties.includes(key as keyof T)) {
        return result;
      }
      return {...result, [key]: response[key as keyof T]};
    }, {} as T);
  };
}
