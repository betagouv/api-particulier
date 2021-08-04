import {captureException} from '@sentry/node';
import {AssertionError, deepStrictEqual} from 'assert';
import {ResponseSent} from 'src/domain/data-fetching/events/response-sent.event';
import {logFor} from 'src/domain/logger';
import {LegacyApiClient} from 'src/domain/quality-monitoring/legacy-api.client';

export class QualityMonitor {
  private readonly logger = logFor(QualityMonitor.name);

  constructor(private readonly legacyApiClient: LegacyApiClient) {}

  async onResponseSent(event: ResponseSent) {
    const legacyResponse = await this.legacyApiClient.callLegacy(
      event.route,
      event.params,
      event.headers
    );

    try {
      deepStrictEqual(
        {statusCode: event.statusCode, body: event.data},
        legacyResponse
      );
    } catch (error) {
      if (error instanceof AssertionError) {
        this.logger.log('warn', 'Response discrepancy with legacy');
      }
      captureException(error);
    }
  }
}
