import {Scope} from './application.aggregate';

export type ScopesFilter<T> = {
  filter(unfilteredData: T, scopes: Scope[]): Partial<T>;
};
