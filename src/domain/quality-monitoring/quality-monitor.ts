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
        this.logger.log('warn', 'Response discrepancy with legacy', {
          message: error.message.replace(
            // eslint-disable-next-line no-control-regex
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
          ),
          legacyReponse: error.expected,
          newResponse: error.actual,
          route: event.route,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          apiKey: event.headers['x-api-key'],
          params: event.params,
        });
      }
      captureException(error);
    }
  }
}
