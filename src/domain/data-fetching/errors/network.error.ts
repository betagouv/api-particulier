export class NetworkError extends Error {
  constructor(readonly status?: number) {
    super('Network error');
  }
}
