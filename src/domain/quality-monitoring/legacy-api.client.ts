export interface LegacyApiClient {
  callLegacy(
    route: string,
    params: object,
    headers: object
  ): Promise<{statusCode: number; body: object}>;
}
