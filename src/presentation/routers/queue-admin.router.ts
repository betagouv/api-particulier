import {Router} from 'express';
import {ExpressAdapter} from '@bull-board/express';
import basicAuth from 'express-basic-auth';
import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {Queue} from 'bullmq';
import {
  applicationEventQueueName,
  tokenEventQueueName,
} from 'src/infrastructure/event-bus/bull.event-bus';
import {redisConnection} from 'src/infrastructure/configuration/redis';

export const queueAdminRouter = Router();

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(
      new Queue(applicationEventQueueName, {connection: redisConnection})
    ),
    new BullMQAdapter(
      new Queue(tokenEventQueueName, {connection: redisConnection})
    ),
  ],
  serverAdapter,
});
serverAdapter.setBasePath('/admin/queues');

queueAdminRouter.use(
  basicAuth({
    users: {
      [process.env.ADMIN_USER || 'admin']:
        process.env.ADMIN_PASSWORD || 'password',
    },
    realm: process.env.ENV,
    challenge: true,
  }),
  serverAdapter.getRouter()
);
