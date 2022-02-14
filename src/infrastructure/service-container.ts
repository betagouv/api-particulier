import {TokenRepositoryWithHashRetry} from 'src/domain/data-fetching/repositories/token-with-hash-retry.repository';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {SvairDataProvider} from 'src/infrastructure/data-providers/dgfip/svair';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {EventBus} from 'src/domain/event-bus';
import {UuidFactory} from 'src/infrastructure/uuid.factory';
import {FetchDataUsecase} from 'src/application/usecases/fetch-data.usecase';
import {TokenProjector} from 'src/domain/data-fetching/projectors/token.projector';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {ChalkLogger} from 'src/infrastructure/chalk.logger';
import {logFor, setInstance} from 'src/domain/logger';
import {DgfipDataPresenter} from 'src/presentation/presenters/dgfip-data.presenter';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';
import {PostgresEntryRepository} from 'src/infrastructure/repositories/postgres-entry.repository';
import {EntryProjector} from 'src/domain/journal/projectors/entry.projector';
import {CnafDataPresenter} from 'src/presentation/presenters/cnaf-data.presenter';
import {postgresPool} from 'src/infrastructure/configuration/postgres';
import {AirtableDgfipDataProvider} from 'src/infrastructure/data-providers/dgfip/airtable';
import {IntrospectUsecase} from 'src/application/usecases/introspect.usecase';
import {IntrospectDataPresenter} from 'src/presentation/presenters/introspect-data.presenter';
import {RandomTokenValueFactory} from 'src/infrastructure/token-value.factory';
import {CreateApplicationUsecase} from 'src/application/usecases/create-application.usecase';
import {PoleEmploiApiDataProvider} from 'src/infrastructure/data-providers/pole-emploi/pole-emploi-api.data-provider';
import {AirtableCnafDataProvider} from 'src/infrastructure/data-providers/cnaf/airtable';
import {PoleEmploiAirtableDataProvider} from 'src/infrastructure/data-providers/pole-emploi/pole-emploi-airtable.data-provider';
import {MesriAirtableDataProvider} from 'src/infrastructure/data-providers/mesri/mesri-airtable.data-provider';
import {MesriSupdataDataProvider} from 'src/infrastructure/data-providers/mesri/mesri-supdata.data-provider';
import {EventEmitterEventBus} from 'src/infrastructure/event-bus/event-emitter.event-bus';
import {routeEvents} from 'src/infrastructure/event-router';
import {MesriDataPresenter} from 'src/presentation/presenters/mesri-data.presenter';
import {PoleEmploiDataPresenter} from 'src/presentation/presenters/pole-emploi-data.presenter';
import {RemoveApplicationUsecase} from 'src/application/usecases/remove-application.usecase';
import {TokenCache} from 'src/domain/data-fetching/token.cache';
import {PostgresApplicationRepository} from 'src/infrastructure/repositories/postgres-application.repository';
import {FetchDataWithFranceConnectUsecase} from 'src/application/usecases/fetch-data-with-france-connect.usecase';
import {FranceConnectClient} from 'src/domain/data-fetching/france-connect.client';
import {Anonymizer} from 'src/domain/journal/anonymizer';
import {CnousApiDataProvider} from 'src/infrastructure/data-providers/cnous/cnous-api.data-provider';
import {CnousDataPresenter} from 'src/presentation/presenters/cnous-data.presenter';

const logger = new ChalkLogger();
setInstance(logger);

const sandboxed = process.env.SANDBOXED !== 'false';

const localLogger = logFor('ServiceContainer');

localLogger.log('info', 'Postgres pool configured');

export const postgresTokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new PostgresTokenRepository(postgresPool));
localLogger.log('info', 'Postgres token repository initialized');

export const eventBus: EventBus = new EventEmitterEventBus();
localLogger.log('info', 'Event bus initialized');

const cnafDataProvider = sandboxed
  ? new AirtableCnafDataProvider()
  : new SoapDataProvider();
localLogger.log(
  'info',
  `CNAF data provider initialized - ${sandboxed ? 'stubbed' : 'real'}`
);
const dgfipDataProvider = sandboxed
  ? new AirtableDgfipDataProvider()
  : new SvairDataProvider();
localLogger.log(
  'info',
  `DGFIP data provider initialized - ${sandboxed ? 'stubbed' : 'real'}`
);
const poleEmploiDataProvider = sandboxed
  ? new PoleEmploiAirtableDataProvider()
  : new PoleEmploiApiDataProvider();
localLogger.log(
  'info',
  `Pôle Emploi data provider initialized - ${sandboxed ? 'stubbed' : 'real'}`
);
const mesriDataProvider = sandboxed
  ? new MesriAirtableDataProvider()
  : new MesriSupdataDataProvider();
localLogger.log(
  'info',
  `MESRI data provider initialized - ${sandboxed ? 'stubbed' : 'real'}`
);

const cnousDataProvider = new CnousApiDataProvider();
localLogger.log(
  'info',
  `CNOUS data provider initialized - ${sandboxed ? 'stubbed' : 'real'}`
);

export const dataProviderClient: DataProviderClient = new DataProviderClient(
  cnafDataProvider,
  dgfipDataProvider,
  poleEmploiDataProvider,
  mesriDataProvider,
  cnousDataProvider
);
localLogger.log('info', 'Data provider client initialized');

export const uuidFactory = new UuidFactory();
localLogger.log('info', 'Uuid factory initialized');

export const tokenValueFactory = new RandomTokenValueFactory(uuidFactory);
localLogger.log('info', 'Token value factory initialized');

export const tokenCache = new TokenCache(postgresTokenRepository);
localLogger.log('info', 'Token cache initialized');

export const franceConnectClient = new FranceConnectClient(tokenCache);
localLogger.log('info', 'FranceConnect client initialized');

export const postgresTokenProjector = new TokenProjector(
  postgresTokenRepository,
  tokenCache
);
localLogger.log('info', 'Postgres token projector initialized');

export const applicationRepository = new PostgresApplicationRepository(
  postgresPool
);
localLogger.log('info', 'Application repository initialized');

export const dgfipDataPresenter = new DgfipDataPresenter();
localLogger.log('info', 'DGFIP data presenter initialized');

export const cnafDataPresenter = new CnafDataPresenter();
localLogger.log('info', 'CNAF data presenter initialized');

export const poleEmploiDataPresenter = new PoleEmploiDataPresenter();
localLogger.log('info', 'Pole Emploi data presenter initialized');

export const mesriDataPresenter = new MesriDataPresenter();
localLogger.log('info', 'MESRI data presenter initialized');

export const cnoustDataPresenter = new CnousDataPresenter();
localLogger.log('info', 'CNOUS data presenter initialized');

export const introspectDataPresenter = new IntrospectDataPresenter();
localLogger.log('info', 'Introspect data presenter initialized');

export const anonymizer = new Anonymizer();
localLogger.log('info', 'Anonymizer initialized');

export const entryRepository: EntryRepository = new PostgresEntryRepository(
  postgresPool
);
localLogger.log('info', 'Journal entry repository initialized');

export const entryProjector = new EntryProjector(entryRepository, anonymizer);
localLogger.log('info', 'Journal entry projector initialized');

export const fetchDataUsecase = new FetchDataUsecase(
  tokenCache,
  dataProviderClient
);
localLogger.log('info', 'Fetch data usecase initialized');

export const fetchDataWithFranceConnectUsecase =
  new FetchDataWithFranceConnectUsecase(
    franceConnectClient,
    dataProviderClient
  );
localLogger.log('info', 'Fetch data usecase initialized');

export const introspectUsecase = new IntrospectUsecase(
  applicationRepository,
  tokenCache
);
localLogger.log('info', 'Introspect usecase initialized');

export const createApplicationUsecase = new CreateApplicationUsecase(
  uuidFactory,
  tokenValueFactory,
  applicationRepository,
  eventBus
);
localLogger.log('info', 'Create application usecase initialized');

export const removeApplicationUsecase = new RemoveApplicationUsecase(
  applicationRepository,
  eventBus
);
localLogger.log('info', 'Remove application usecase initialized');

routeEvents();
