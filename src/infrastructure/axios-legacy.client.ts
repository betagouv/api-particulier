import axios from 'axios';
import {LegacyApiClient} from 'src/domain/quality-monitoring/legacy-api.client';

export class AxiosLegacyApiClient implements LegacyApiClient {
  async callLegacy(
    route: string,
    params: object,
    headers: object
  ): Promise<{statusCode: number; body: object}> {
    try {
      const response = await axios.get(
        `https://particulier.api.gouv.fr/api${route}`,
        {
          params,
          headers,
        }
      );
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
