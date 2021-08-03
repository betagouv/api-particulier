import axios from 'axios';
import {logFor} from 'src/domain/logger';
import {LegacyApiClient} from 'src/domain/quality-monitoring/legacy-api.client';

export class AxiosLegacyApiClient implements LegacyApiClient {
  private readonly logger = logFor(AxiosLegacyApiClient.name);

  async callLegacy(
    route: string,
    params: object,
    headers: object
  ): Promise<{statusCode: number; body: object}> {
    try {
      const url =
        process.env.STUB_DATA_PROVIDERS === 'true'
          ? `https://particulier-test.api.gouv.fr/no-mirror${route}`
          : `https://particulier.api.gouv.fr/no-mirror${route}`;
      this.logger.log('debug', 'Calling legacy API', {
        route,
        params,
        headers,
        url,
      });
      const response = await axios.get(url, {
        params,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers: {'X-Api-Key': headers['x-api-key']},
      });
      return {
        statusCode: response.status,
        body: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          statusCode: error.response?.status || 502,
          body: error.response?.data,
        };
      }
      throw error;
    }
  }
}
