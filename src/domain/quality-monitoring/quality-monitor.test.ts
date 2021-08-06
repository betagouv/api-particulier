import {expect} from 'chai';
import {ResponseSent} from 'src/domain/data-fetching/events/response-sent.event';
import {Logger, setInstance} from 'src/domain/logger';
import {LegacyApiClient} from 'src/domain/quality-monitoring/legacy-api.client';
import {QualityMonitor} from 'src/domain/quality-monitoring/quality-monitor';
import {stubInterface} from 'ts-sinon';

describe('The quality monitor', () => {
  it('logs any response discrepancy', async () => {
    const statusCode = 200;
    const body = {yolo: 'croute'};
    const event = new ResponseSent(
      '',
      new Date(),
      '/lol',
      {yolo: 'lol'},
      {},
      204,
      body
    );

    const legacyApiClient = stubInterface<LegacyApiClient>();
    const logger = stubInterface<Logger>();
    setInstance(logger);
    legacyApiClient.callLegacy.resolves({statusCode, body});

    const qualityMonitor = new QualityMonitor(legacyApiClient);

    await qualityMonitor.onResponseSent(event);

    expect(logger.log).to.have.been.calledOnce;
  });
});
