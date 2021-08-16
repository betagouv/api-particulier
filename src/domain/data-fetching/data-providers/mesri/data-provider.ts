import {DataProvider} from 'src/domain/data-fetching/data-providers/data-provider';
import {
  MesriInput,
  MesriMetadata,
  MesriOutput,
} from 'src/domain/data-fetching/data-providers/mesri/dto';

export type MesriDataProvider = DataProvider<
  MesriInput,
  MesriOutput,
  MesriMetadata
>;
