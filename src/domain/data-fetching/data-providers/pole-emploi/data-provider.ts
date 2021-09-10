import {DataProvider} from 'src/domain/data-fetching/data-providers/data-provider';
import {
  PoleEmploiInput,
  PoleEmploiMetadata,
  PoleEmploiOutput,
} from 'src/domain/data-fetching/data-providers/pole-emploi/dto';

export type PoleEmploiDataProvider = DataProvider<
  PoleEmploiInput,
  PoleEmploiOutput,
  PoleEmploiMetadata
>;
