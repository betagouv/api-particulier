import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import {TokenRepositoryWithHashRetry} from 'src/domain/data-fetching/repositories/token-with-hash-retry.repository';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {SvairDataProvider} from 'src/infrastructure/data-providers/dgfip/svair';
import {EventStore} from 'src/domain/event-store';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {EventBus, EventBus2} from 'src/domain/event-bus';
import {UuidFactory} from 'src/infrastructure/uuid.factory';
import {FetchDataUsecase} from 'src/application/usecases/fetch-data.usecase';
import {TokenProjector} from 'src/domain/data-fetching/projectors/token.projector';
import {EventSourcedApplicationRepository} from 'src/infrastructure/repositories/event-sourced-application.repository';
import {ApplicationTransactionManager} from 'src/domain/application-management/application-transaction-manager';
import {PostgresTokenRepository} from 'src/infrastructure/repositories/postgres-token.repository';
import {RepositoryFeeder} from 'src/domain/data-fetching/repository-feeder';
import {ChalkLogger} from 'src/infrastructure/chalk.logger';
import {logFor, setInstance} from 'src/domain/logger';
import {DgfipDataPresenter} from 'src/presentation/presenters/dgfip-data.presenter';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';
import {PostgresEntryRepository} from 'src/infrastructure/repositories/postgres-entry.repository';
import {EntryProjector} from 'src/domain/journal/projectors/entry.projector';
import {CnafDataPresenter} from 'src/presentation/presenters/cnaf-data.presenter';
import {postgresPool} from 'src/infrastructure/configuration/postgres';
import {redisConnection} from 'src/infrastructure/configuration/redis';
import {AirtableDgfipDataProvider} from 'src/infrastructure/data-providers/dgfip/airtable';
import {PostgresApplicationProjectionRepository} from 'src/infrastructure/repositories/postgres-application-projection.repository';
import {ApplicationProjector} from 'src/domain/application-management/projectors/application-projection.projector';
import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';
import {IntrospectUsecase} from 'src/application/usecases/introspect.usecase';
import {IntrospectDataPresenter} from 'src/presentation/presenters/introspect-data.presenter';
import {RandomTokenValueFactory} from 'src/infrastructure/token-value.factory';
import {CreateApplicationUsecase} from 'src/application/usecases/create-application.usecase';
import {PoleEmploiApiDataProvider} from 'src/infrastructure/data-providers/pole-emploi/pole-emploi-api.data-provider';
import {AirtableCnafDataProvider} from 'src/infrastructure/data-providers/cnaf/airtable';
import {PoleEmploiAirtableDataProvider} from 'src/infrastructure/data-providers/pole-emploi/pole-emploi-airtable.data-provider';
import {MesriAirtableDataProvider} from 'src/infrastructure/data-providers/mesri/mesri-airtable.data-provider';
import {SubscribeUserUsecase} from 'src/application/usecases/subscribe-user.usecase';
import {MesriSupdataDataProvider} from 'src/infrastructure/data-providers/mesri/mesri-supdata.data-provider';
import {EventEmitterEventBus} from 'src/infrastructure/event-bus/event-emitter.event-bus';
import {routeEvents} from 'src/infrastructure/event-router';

const logger = new ChalkLogger();
setInstance(logger);

const sandboxed = process.env.SANDBOXED !== 'false';

const localLogger = logFor('ServiceContainer');

localLogger.log('info', 'Postgres pool configured');

export const eventStore: EventStore = new PostgresEventStore(postgresPool);
localLogger.log('info', 'Event store initialized');

localLogger.log('info', 'Redis connection configured');

export const redisTokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new RedisTokenRepository(redisConnection));
localLogger.log('info', 'Redis token repository initialized');
export const postgresTokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new PostgresTokenRepository(postgresPool));
localLogger.log('info', 'Postgres token repository initialized');

export const eventBus: EventBus = new BullEventBus(redisConnection);
localLogger.log('info', 'Event bus initialized');

export const eventBus2: EventBus2 = new EventEmitterEventBus();
localLogger.log('info', 'Event bus 2 initialized');

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

export const dataProviderClient: DataProviderClient = new DataProviderClient(
  cnafDataProvider,
  dgfipDataProvider,
  poleEmploiDataProvider,
  mesriDataProvider
);
localLogger.log('info', 'Data provider client initialized');

export const uuidFactory = new UuidFactory();
localLogger.log('info', 'Uuid factory initialized');

export const tokenValueFactory = new RandomTokenValueFactory(uuidFactory);
localLogger.log('info', 'Token value factory initialized');

export const redisTokenProjector = new TokenProjector(redisTokenRepository);
localLogger.log('info', 'Redis token projector initialized');
export const postgresTokenProjector = new TokenProjector(
  postgresTokenRepository
);
localLogger.log('info', 'Postgres token projector initialized');

export const applicationRepository = new EventSourcedApplicationRepository(
  eventStore
);
localLogger.log('info', 'Application repository initialized');

export const applicationTransactionManager = new ApplicationTransactionManager(
  applicationRepository,
  eventBus2,
  eventStore
);
localLogger.log('info', 'Application transaction manager initialized');

export const repositoryFeeder = new RepositoryFeeder(
  redisTokenRepository,
  postgresTokenRepository
);
localLogger.log('info', 'Repository feeder initialized');

export const dgfipDataPresenter = new DgfipDataPresenter();
localLogger.log('info', 'DGFIP data presenter initialized');

export const cnafDataPresenter = new CnafDataPresenter();
localLogger.log('info', 'CNAF data presenter initialized');

export const introspectDataPresenter = new IntrospectDataPresenter();
localLogger.log('info', 'Introspect data presenter initialized');

export const entryRepository: EntryRepository = new PostgresEntryRepository(
  postgresPool
);
localLogger.log('info', 'Journal entry repository initialized');

export const entryProjector = new EntryProjector(entryRepository);
localLogger.log('info', 'Journal entry projector initialized');

export const applicationProjectionRepository: ApplicationProjectionRepository =
  new PostgresApplicationProjectionRepository(postgresPool);
localLogger.log('info', 'Application projection repository initialized');

export const applicationProjector = new ApplicationProjector(
  applicationProjectionRepository
);
localLogger.log('info', 'Application projector initialized');

export const fetchDataUsecase = new FetchDataUsecase(
  redisTokenRepository,
  dataProviderClient,
  eventBus
);
localLogger.log('info', 'Fetch data usecase initialized');

export const introspectUsecase = new IntrospectUsecase(
  applicationProjectionRepository,
  redisTokenRepository
);
localLogger.log('info', 'Introspect usecase initialized');

export const subscribeUserUsecase = new SubscribeUserUsecase(
  applicationTransactionManager
);
localLogger.log('info', 'Subscribe user usecase initialized');

export const createApplicationUsecase = new CreateApplicationUsecase(
  applicationTransactionManager,
  uuidFactory,
  tokenValueFactory
);
localLogger.log('info', 'Create application usecase initialized');

routeEvents();
