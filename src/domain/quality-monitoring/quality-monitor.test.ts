// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {ResponseSent} from 'src/domain/data-fetching/events/response-sent.event';
import {Logger, setInstance} from 'src/domain/logger';
import {LegacyApiClient} from 'src/domain/quality-monitoring/legacy-api.client';
import {QualityMonitor} from 'src/domain/quality-monitoring/quality-monitor';

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

    const legacyApiClient = mock<LegacyApiClient>();
    const logger = mock<Logger>();
    setInstance(logger);
    legacyApiClient.callLegacy.mockResolvedValue({statusCode, body});

    const qualityMonitor = new QualityMonitor(legacyApiClient);

    await qualityMonitor.onResponseSent(event);

    expect(logger.log).toHaveBeenCalled();
  });
});
