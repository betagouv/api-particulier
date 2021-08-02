import {PostgresEventStore} from 'src/infrastructure/postgres.event-store';
import {TokenRepositoryWithHashRetry} from 'src/domain/data-fetching/repositories/token-with-hash-retry.repository';
import {RedisTokenRepository} from 'src/infrastructure/repositories/redis-token.repository';
import {BullEventBus} from 'src/infrastructure/event-bus/bull.event-bus';
import {DataProviderClient} from 'src/domain/data-fetching/data-provider-client';
import {SoapDataProvider} from 'src/infrastructure/data-providers/cnaf/soap';
import {SvairDataProvider} from 'src/infrastructure/data-providers/dgfip/svair';
import {EventStore} from 'src/domain/event-store';
import {TokenRepository} from 'src/domain/data-fetching/repositories/token.repository';
import {EventBus} from 'src/domain/event-bus';
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
import {AxiosLegacyApiClient} from 'src/infrastructure/axios-legacy.client';
import {QualityMonitor} from 'src/domain/quality-monitoring/quality-monitor';
import {EntryRepository} from 'src/domain/journal/repositories/entry.repository';
import {PostgresEntryRepository} from 'src/infrastructure/repositories/postgres-entry.repository';
import {EntryProjector} from 'src/domain/journal/projectors/entry.projector';
import {CnafDataPresenter} from 'src/presentation/presenters/cnaf-data.presenter';
import {postgresPool, redisConnection} from 'src/infrastructure/configuration';

const logger = new ChalkLogger();
setInstance(logger);

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

const cnafDataProvider = new SoapDataProvider();
localLogger.log('info', 'CNAF data provider initialized');
const dgfipDataProvider = new SvairDataProvider();
localLogger.log('info', 'DGFIP data provider initialized');

export const dataProviderClient: DataProviderClient = new DataProviderClient(
  cnafDataProvider,
  dgfipDataProvider
);
localLogger.log('info', 'Data provider client initialized');

export const uuidFactory = new UuidFactory();
localLogger.log('info', 'Uuid factory initialized');

export const fetchDataUsecase = new FetchDataUsecase(
  redisTokenRepository,
  dataProviderClient,
  eventBus
);
localLogger.log('info', 'Fetch data usecase initialized');

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
  eventBus,
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

export const legacyApiClient = new AxiosLegacyApiClient();
localLogger.log('info', 'Legacy API client initialized');

export const qualityMonitor = new QualityMonitor(legacyApiClient);
localLogger.log('info', 'Quality monitor initialized');

export const entryRepository: EntryRepository = new PostgresEntryRepository(
  postgresPool
);
localLogger.log('info', 'Journal entry repository initialized');

export const entryProjector = new EntryProjector(entryRepository);
localLogger.log('info', 'Journal entry projector initialized');
