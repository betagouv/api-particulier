import {Client} from 'pg';
import * as IORedis from 'ioredis';
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

const postgresClient = new Client(process.env.DATABASE_URL);

export const eventStore: EventStore = new PostgresEventStore(postgresClient);

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

export const tokenRepository: TokenRepository =
  new TokenRepositoryWithHashRetry(new RedisTokenRepository(redisConnection));

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
  tokenRepository,
  dataProviderClient
);
