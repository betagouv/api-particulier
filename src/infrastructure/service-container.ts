const IORedis = require('ioredis');
import {Pool} from 'pg';
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
import {setInstance} from 'src/domain/logger';

const logger = new ChalkLogger();
setInstance(logger);

export const postgresPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const eventStore: EventStore = new PostgresEventStore(postgresPool);

export const redisConnection = new IORedis(process.env.REDIS_URL);

export const redisTokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new RedisTokenRepository(redisConnection));
export const postgresTokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new PostgresTokenRepository(postgresPool));

export const eventBus: EventBus = new BullEventBus(redisConnection);

const cnafDataProvider = new SoapDataProvider();
const dgfipDataProvider = new SvairDataProvider();

export const dataProviderClient: DataProviderClient = new DataProviderClient(
  cnafDataProvider,
  dgfipDataProvider,
  eventBus
);

export const uuidFactory = new UuidFactory();

export const fetchDataUsecase = new FetchDataUsecase(
  redisTokenRepository,
  dataProviderClient,
  eventBus
);

export const redisTokenProjector = new TokenProjector(redisTokenRepository);
export const postgresTokenProjector = new TokenProjector(
  postgresTokenRepository
);

export const applicationRepository = new EventSourcedApplicationRepository(
  eventStore
);

export const applicationTransactionManager = new ApplicationTransactionManager(
  applicationRepository,
  eventBus,
  eventStore
);

export const repositoryFeeder = new RepositoryFeeder(
  redisTokenRepository,
  postgresTokenRepository
);
