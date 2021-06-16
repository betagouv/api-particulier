export class NetworkError extends Error {
  constructor(readonly wrappedError: Error) {
    super('Network error');
  }
}
