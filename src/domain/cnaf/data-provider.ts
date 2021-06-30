import {DataProvider} from '../data-fetching/data-provider';
import {CNAFInput, CNAFOutput} from './dto';

export type CNAFDataProvider = DataProvider<CNAFInput, CNAFOutput>;
