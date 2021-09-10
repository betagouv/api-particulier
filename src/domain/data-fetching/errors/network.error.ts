export class NetworkError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}
