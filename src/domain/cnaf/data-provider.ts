import {DataProvider} from '../application/data-provider';
import {CNAFInput, CNAFOutput} from './dto';

export type CNAFDataProvider = DataProvider<CNAFInput, CNAFOutput>;