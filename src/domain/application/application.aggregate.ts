import {Brand} from '../branded-types';
import {DGFIPDataProvider} from './dgfip.data-provider';
import {DGFIPInput, DGFIPOutput} from './dgfip.dto';

export type ApplicationId = Brand<string, 'ApplicationId'>;

export class Application {
  async consumeDGFIP(
    input: DGFIPInput,
    provider: DGFIPDataProvider
  ): Promise<Partial<DGFIPOutput>> {
    return provider.fetch(input);
  }
}
